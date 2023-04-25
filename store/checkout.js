// Core
import { v4 as uuidv4 } from "uuid";
import { useCustomCheckoutStore } from "~/store/customCheckout";
import { useProductStore } from "~/store/product";

export const useCheckoutStore = defineStore("checkout", {
  state: () => ({
    global_loading: true,
    global_settings: {
      captcha: "",
      antifraud: "",
      monthly_interest: "",
      country: "BR",
    },
    url: {
      params: null,
      query: null,
      fullPath: "",
    },
    /* Methods */
    allowed_methods: [],
    method: "",
    /* Installments */
    installments: 0,
    ticket_installments: 0,
    max_installments: 0,
    fixed_installments: 0,
    /**
     * Amount
     */
    amount: 0,
    original_amount: 0,
    /**
     * Error
     */
    hasError: false,
    /**
     * Coupon
     */
    coupon: {
      amount: 0,
      applied: false,
      available: 0,
      discount: 0,
      due_date: "",
      error: false,
      is_valid: false,
      loading: false,
      name: "",
    },
    is_heaven: false,
    /**
     * Product List
     */
    product_list: [],
    products_client_statistics: [],
    /**
     * Order Bump List
     */
    order_bumps: [],
    bump_list: [],
    /* Payment details */
    checkoutPayment: null,
    /* UUID */
    uuid: uuidv4(),
    sales: {},
    productOffer: {},
  }),
  getters: {
    isLoading: (state) => state.global_loading,
    /**
     * Query getters
     */
    hasAffiliateId: (state) => state.url.query?.a_id,
    hasBusiness: (state) => state.url.query?.b, // Jivochat
    hasBump: (state) => state.url.fullPath.includes("b_id"),
    hasNewBump: (state) => state.url.fullPath.includes("b_id_1"),
    hasCoupon: (state) => state.url.query?.cupom ?? "",
    hasCustomCheckout: (state) => state.url.query?.ch_id,
    hasDocument: (state) => state.url.query?.document,
    hasDebugPixel: (state) => state.url.query?.debugPixel === "true",
    hasEmail: (state) => state.url.query?.em,
    hasForce: (state) => state.url.query?.force === "true",
    hasPhone: (state) => state.url.query?.ph,
    hasUpsell: (state) => state.url.query?.up_id,
    hasSelectedBump: (state) => state.bump_list.some((bump) => bump.checkbox),
    /**
     * Others
     */
    product_id: (state) => state.url.params.product_id,
    product_offer: (state) => state.url.params.hash,
    /**
     * Global settings
     */
    captcha: (state) => state.global_settings.captcha,
    antifraud: (state) => state.global_settings.antifraud,
    monthly_interest: (state) => state.global_settings.monthly_interest,
    selectedCountry: (state) => state.global_settings.country,
    /**
     * Juros
     */
    hasFees: (state) => {
      const product = useProductStore();
      return state.method === "CREDIT_CARD" ? product.hasFees : false;
    },
    isHeaven: (state) => state.is_heaven,
    /**
     * @description this method validate if checkout is greenn or heaven and if product is greenn or heaven
     */
    isValid(state) {
      return () => {
        const product = useProductStore();
        return (
          (product.isHeaven && this.isHeaven) ||
          (!product.isHeaven && !this.isHeaven)
        );
      };
    },
    showAddressStep(state) {
      return () => {
        const product = useProductStore();
        return (
          !!this.antifraud || !!product.showAddress || this.hasPhysicalProduct()
        );
      };
    },
    hasPhysicalProduct(state) {
      return () => {
        const product = useProductStore();
        return (
          product.isPhysicalProduct ||
          state.bump_list.some(
            (bump) => bump.format === "PHYSICALPRODUCT" && bump.checkbox
          )
        );
      };
    },
    getBumpList: (state) => state.bump_list,
    totalAmount(state) {
      return () => {
        const product = useProductStore();
        const productAmount = this.coupon.applied
          ? this.coupon.discount
          : product.amount;
        const initial = 0;
        const amountBumps = this.bump_list
          .filter((item) => item.checkbox)
          .reduce(function (accumulator, current) {
            const amount = current.amount;
            if (current?.shipping?.amount) {
              amount += current?.shipping?.amount;
            }
            return accumulator + amount;
          }, initial);
        return productAmount + amountBumps;
      };
    },
    shippingProducts(state) {
      return () => {
        return this.product_list.filter(
          (item) => item.format === "PHYSICALPRODUCT"
        );
      };
    },
  },
  actions: {
    async init() {
      this.resetProducts();
      this.setLoading(true);
      await this.getGlobalSettings();

      const { params, query, fullPath } = useRoute();
      this.url.params = params;
      this.url.query = query;
      this.url.fullPath = fullPath;
      if (!!this.hasCustomCheckout) {
        const customCheckout = useCustomCheckoutStore();
        await customCheckout.getCustomCheckout();
      }
      await this.getProduct(this.product_id, this.product_offer);

      /* Initial configs */
      this.setCoupon(true);
      if (this.hasBump) this.getBumps();
      this.setLoading();
    },
    async getGlobalSettings() {
      const keys = [
        "PAGARME_ANTIFRAUDE",
        "MONTHLY_INTEREST",
        "CHECKOUT_CAPTCHA",
      ];
      const query = { keys: keys.join(",") };
      try {
        await useApi()
          .read("/global-settings", { query })
          .then((res) => {
            res.forEach((item) => {
              if (item.key == "PAGARME_ANTIFRAUDE") {
                this.global_settings.antifraud =
                  item.value == "ENABLED" ? true : false;
              }
              if (item.key == "MONTHLY_INTEREST") {
                this.global_settings.monthly_interest = parseFloat(item.value);
              }
              if (item.key == "CHECKOUT_CAPTCHA") {
                this.global_settings.captcha =
                  item.value == "ENABLED" ? true : false;
              }
            });
            let countryGlobalSettings = [...res].find((item) => item.country);
            this.global_settings.country = countryGlobalSettings
              ? countryGlobalSettings.country
              : "US";
          });
      } catch (error) {
        this.setError("Ocorreu um erro ao processar os dados do produto");
        this.global_settings.country = "BR";
        this.setLoading();
      }
    },
    async getProduct(id, offer = null, isBump = false, configs = {}) {
      const product = useProductStore();
      const { setProduct } = product;
      /* Get country */
      const cookie = useCookie("locale");
      const country = cookie.value?.sigla;
      /* Set product url */
      const url = offer
        ? `/product/checkout/${id}/offer/${offer}`
        : `/product/checkout/${id}`;
      /* Set country in query */
      const query = {};
      if (country) query.country = country;
      if (this.selectedCountry !== "BR" && !country) {
        query.country = this.selectedCountry;
      }
      /* Call api to get product */
      try {
        await useApi()
          .read(url, {
            ...configs,
            query,
          })
          .then((response) => {
            if (
              response.checkout_payment &&
              response.checkout_payment.data &&
              response.checkout_payment.data.amount
            ) {
              response.data.amount = response.checkout_payment.data.amount;
            }

            if (response.checkout_payment && response.checkout_payment.paypal) {
              response.data.paypal = response.checkout_payment.paypal;
            }

            if (response.data.format === "PHYSICALPRODUCT") {
              if (response.data.type_shipping_fee === "FIXED") {
                const shipping = {};
                shipping.amount = response.data.amount_fixed_shipping_fee;
                response.data = { ...response.data, shipping };
              }
            }

            if (response?.data && !isBump) {
              this.checkoutPayment = response.checkout_payment;
              setProduct(response.data);
            } else {
              this.bump_list.push({ ...response.data, checkbox: false });
            }
          });
      } catch (error) {
        this.setError("Ocorreu um erro ao processar a sua solicitação");
        this.setLoading();
      }
    },
    async getCoupon() {
      let url = `/coupon/check/${this.coupon.name}/${this.url.params.product_id}`;
      if (this.url.params.hash) {
        url = url + `/offer/${this.url.params.hash}`;
      }
      const query = {
        country: this.selectedCountry,
      };
      try {
        const res = await useApi().read(url, { query });
        return res;
      } catch (error) {
        throw error;
      } finally {
        this.coupon.loading = false;
      }
    },
    async getBumps() {
      if (!this.hasNewBump) {
        await this.getOldBumps();
        return;
      }
      this.bump_list = [];
      // parse apenas dos params
      let searchParams = new URLSearchParams(this.url.query);
      // instancia o array final
      let bumpsWithOffers = [];
      // regex para pegar ids dos bumps
      let bumpRegex = new RegExp("(b_id_)(\\d*$)", "i");
      // regex para pegar o hash das ofertas
      let offerRegex = new RegExp("(b_offer_)(\\d*$)", "i");
      // passamos uma vez apenas pegando o id dos produtos
      searchParams.forEach((value, key) => {
        let matches = key.match(bumpRegex);
        if (matches) {
          // caso esteja repetido, ignoramos
          if (!bumpsWithOffers.find((item) => item.bump_id === matches[2])) {
            // setamos o id do produto junto com a posicional para depois encontrar a oferta
            bumpsWithOffers.push({ bump_id: matches[2], product_id: value });
          }
        }
      });
      // passamos novamente pois temos certeza que os produtos estão no array
      searchParams.forEach((value, key) => {
        let matches = key.match(offerRegex);
        if (matches) {
          // pegamos o index do produto pelo id posicional dos elementos
          let indexOfBump = bumpsWithOffers
            .map((item) => item.bump_id)
            .indexOf(matches[2]);
          // caso exista
          if (bumpsWithOffers[indexOfBump]) {
            let bump = bumpsWithOffers[indexOfBump];
            bump.offer_hash = value;
            // sobrescrevemos o objeto com id da oferta
            bumpsWithOffers[indexOfBump] = bump;
          }
        }
      });

      if (bumpsWithOffers.length) {
        this.products_client_statistics = [];
        bumpsWithOffers.forEach((bump) => {
          if (this.product_id !== bump.product_id)
            this.getProduct(bump.product_id, bump.offer_hash, true);
        });
      }
    },
    async getOldBumps() {
      if (typeof this.url.query.b_id === "string") {
        this.getProduct(this.url.query.b_id, this.url.query.b_offer, true);
      } else {
        for (let b in this.url.query.b_id) {
          this.getProduct(this.url.query.b_id[b], null, true);
          this.products_client_statistics.push({
            product_id: +this.url.query.b_id[b],
          });
        }
      }
    },
    setAllowedMethods(allowed_methods = []) {
      this.allowed_methods = [];
      this.allowed_methods = allowed_methods;
      this.setMethod(
        allowed_methods.includes("CREDIT_CARD")
          ? "CREDIT_CARD"
          : allowed_methods[0]
      );
    },
    setAmount(amount = 0) {
      this.amount = amount;
    },
    async setCoupon(initial = false, remove = false) {
      const store = useProductStore();
      if (remove) {
        store.amount = store.original_amount;
        this.coupon = {
          amount: 0,
          applied: false,
          available: null,
          discount: 0,
          due_date: null,
          error: null,
          is_valid: false,
          loading: false,
          name: "",
        };
        return;
      }
      if (!!this.hasCoupon && initial) {
        this.coupon.name = this.hasCoupon;
      }
      if (!!this.coupon.name) {
        this.coupon.loading = true;
        const current_amount = this.amount;

        await this.getCoupon()
          .then(({ amount, available, due_date }) => {
            this.coupon.amount = Math.abs(store.amount - amount);
            this.coupon.available = available;
            this.coupon.due_date = due_date;
            this.coupon.discount = amount;

            store.amount -= this.coupon.amount;
            this.amount -= this.coupon.amount;

            this.coupon.error = false;
            this.coupon.applied = true;
            this.coupon.is_valid = true;
          })
          .catch((error) => {
            this.coupon = {
              amount: 0,
              applied: false,
              available: null,
              discount: 0,
              due_date: null,
              error: null,
              is_valid: false,
              loading: false,
              name: "",
            };
            this.coupon.error = true;
          });
      }
    },
    setInstallments(
      installments = null,
      maxInstallments = null,
      fixed = null,
      ticket = null
    ) {
      this.installments = fixed ?? installments ?? 1;
      if (maxInstallments) this.max_installments = maxInstallments;
      if (fixed) this.fixed_installments = fixed;
      if (ticket) this.ticket_installments = 1;
    },
    setMethod(method = "") {
      this.method = method;
      if (this.method !== "CREDIT_CARD") this.setInstallments();
    },
    setOriginalAmount(amount = 0) {
      this.original_amount = amount;
    },
    setLoading(value = false) {
      this.global_loading = value;
    },
    setError(error = "") {
      this.hasError = true;
      showError({
        statusCode: 404,
        message: error,
      });
    },
    setProjectDomain(url = "") {
      const config = useRuntimeConfig();
      this.is_heaven = url.includes(config.public.HEAVEN_CHECKOUT_PAGE);
    },
    setProductList(product) {
      const index = this.product_list
        .map((item) => item.id)
        .indexOf(product.id);

      this.checkAllowedMethods();
      if (index === -1) {
        this.product_list.push(product);
        this.setAmount(product.amount);
        this.setOriginalAmount(product.amount);
        return;
      }
      this.product_list.splice(index, 1);
    },
    resetProducts() {
      this.product_list = [];
      this.bump_list = [];
      this.order_bumps = [];
      this.products_client_statistics = [];
    },
    checkAllowedMethods() {
      const store = useProductStore();
      let allowed_methods = store.product.method.split(",");
      /* Check if exist selected subscription bump */
      if (
        this.bump_list.filter((i) => i.checkbox && i.type === "SUBSCRIPTION")
          .length
      ) {
        this.bump_list
          .filter((i) => i.checkbox)
          .map((bump) => {
            allowed_methods = allowed_methods.filter((method) =>
              bump.method.includes(method)
            );
          });
      }
      /* check if product has shipping fee and has trial, when remove "PIX" method */
      if (!store.product.has_shipping_fee && store.product.trial) {
        allowed_methods = allowed_methods.filter((method) => method !== "PIX");
      }
      /* check if has bump with shipping fee and trial, when remove "PIX" method */
      if (
        this.bump_list.filter(
          (i) => i.checkbox && !i.has_shipping_fee && i.trial
        ).length
      ) {
        allowed_methods = allowed_methods.filter((method) => method !== "PIX");
      }
      /* Remove paypal when has selected bump */
      if (this.hasSelectedBump) {
        allowed_methods = allowed_methods.filter(
          (method) => method !== "PAYPAL"
        );
      }
      /* Set new method when actual method was removed */
      if (!allowed_methods.includes(this.method)) {
        this.setAllowedMethods(allowed_methods);
        return;
      }
      this.allowed_methods = allowed_methods;
    },
    async getSale(id) {
      if (!!id) {
        try {
          const sales = await useApi().read(`/sale-checkout/${id}`);
          if (!!sales) this.sales = sales;
        } catch (error) {
          this.setError(error.message);
          throw error;
        }
      }
    },
    async getProductOffer(productId, offer) {
      if (!!productId) {
        try {
          const productOffer = await useApi().read(
            `/product/${productId}/offer/${offer}`
          );
          if (!!productOffer) this.productOffer = productOffer;
        } catch (e) {
          this.setError(e.message);
          throw e;
        }
      }
    },
  },
});
