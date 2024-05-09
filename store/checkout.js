import * as Toast from "vue-toastification";
import { useCustomCheckoutStore } from "~/store/customCheckout";
import { useProductStore } from "~/store/product";
import { usePreCheckoutStore } from "~~/store/preCheckout";
import { usePurchaseStore } from "./forms/purchase";
import { useAmountStore } from "./modules/amount";
import { defineStore, storeToRefs } from "pinia";
import { GreennLogs } from "@/utils/greenn-logs";
import { haveAvailableTickets } from "@/utils/validateBatch";

const purchaseStore = usePurchaseStore();
const amountStore = useAmountStore();

export const useCheckoutStore = defineStore("checkout", {
  state: () => ({
    uuid: null,
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
    batches_list: [],
    /* Payment details */
    checkoutPayment: null,
    // Captcha
    captcha_code: "",

    sales: {},
    productOffer: {},
    deliveryOptions: {},
    shipping_selected: {},
    // Paypal details
    paypal_details: {},
    allow_free_offers : null,
    hasIntegrationWithGreennEnvios: false,
    isCreditCard: false
  }),
  getters: {
    isLoading: (state) => state.global_loading,
    /**
     * Query getters
     */
    getAmount: (state) => state.amount,
    hasAffiliateId: (state) => state.url.query?.a_id ?? null,
    hasBusiness: (state) => state.url.query?.b, // Jivochat
    hasBump: (state) => state.url.fullPath.includes("b_id"),
    hasNewBump: (state) => state.url.fullPath.includes("b_id_1"),
    hasCoupon: (state) => state.url.query?.cupom ?? "",
    hasCustomCheckout: (state) => state.url.query?.ch_id,
    hasBatches: (state) => state.url.fullPath.includes("bt_id"),
    hasDocument: (state) => state.url.query?.document,
    hasDebugPixel: (state) => state.url.query?.debugPixel === "true",
    hasEmail: (state) => state.url.query?.em,
    hasForce: (state) => state.url.query?.force === "true",
    hasPhone: (state) => state.url.query?.ph,
    hasUpsell: (state) => state.url.query?.up_id,
    hasBumpForceCheck: (state) => state.url.query?.b_fc,
    hasSelectedBump: (state) => state.bump_list.some((bump) => bump.checkbox),
    hasFreeBump: (state) => state.bump_list.every(bump => bump.method === 'FREE'),
    /**
     * Others
     */
    product_id: (state) => state?.url?.params?.product_id,
    product_offer: (state) => state?.url?.params?.hash,
    /**
     * Global settings
     */
    captchaEnabled: (state) => state.global_settings.captcha,
    antifraud: (state) => state.global_settings.antifraud,
    monthly_interest: (state) => state.global_settings.monthly_interest,
    selectedCountry: (state) => state.global_settings.country,
    /**
     * Juros
     */
    hasFees: (state) => {
      const product = useProductStore();
      return ["CREDIT_CARD", "TWO_CREDIT_CARDS", "BOLETO"].includes(
        state.method
      )
        ? product.hasFees
        : false;
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
    showAddressStep() {
      const preCheckout = usePreCheckoutStore();
      const { sellerHasFeatureTickets } = storeToRefs(preCheckout);
      const { product } = useProductStore();
      let productEventHasAddress = false;
      if(sellerHasFeatureTickets.value && product.is_checkout_address){
        productEventHasAddress = true;
      }
      return (
        !!this.antifraud ||
        this.hasPhysicalProduct ||
        this.hasCheckoutAddress ||
        productEventHasAddress
      );
    },
    hasPhysicalProduct(state) {
      return state.product_list.some(
        (product) => product.format === "PHYSICALPRODUCT"
      );
    },
    hasCheckoutAddress(state) {
      return state.product_list.some((product) => !!product.is_checkout_address);
    },
    getBumpList: (state) => state.bump_list,
    getBatcheList:(state) => state.batches_list,
    getBumpsWithShippingFee(state) {
      let filter = state.bump_list.filter(
        (bump) =>
          !!bump.has_shipping_fee &&
          bump.checkbox &&
          bump.type_shipping_fee === "DYNAMIC"
      );
      filter.map(b => {
        return {...b, hasIntegrationWithGreennEnvios: b.hasIntegrationWithGreennEnvios || false}
      });
      return filter;
    },
    shippingProducts(state) {
      return () => {
        return this.product_list.filter(
          (item) => item.format === "PHYSICALPRODUCT"
        );
      };
    },
    getShippingSelected: (state) => state.shipping_selected,
    getIsCreditCard: (state) => state.isCreditCard
  },
  actions: {
    async init(byChangeCountry = false, routeIsCheckout = false) {
      const { product } = useProductStore();
      const preCheckout = usePreCheckoutStore();
      const { sellerHasFeatureTickets } = storeToRefs(preCheckout);
      if(product.id && product.product_type_id === 3 && sellerHasFeatureTickets?.value) return
      this.resetProducts();
      amountStore.reset();
      this.setLoading(true);

      if (!byChangeCountry && !process.client) {
        const headers = useRequestHeaders(["cf-ipcountry"]);
        this.global_settings.country = headers["cf-ipcountry"] || "BR";
      }

      const { params, query, fullPath } = useRoute();

      GreennLogs.logger.info("🟢 Checkout init", {
        params: params, query: query, fullPath: fullPath
      });

      this.url.params = params;
      this.url.query = query;
      this.url.fullPath = fullPath;
      /* Initial configs */
      const res = await this.getProduct(this.product_id, this.product_offer, false, {}, 0, this.getBatcheList);
      await this.setCoupon(true, false, routeIsCheckout);
      if (this.hasBump) this.getBumps();
      if (!!res.data.seller?.donation_offer) this.getBumps(true);
      if (this.hasBatches) this.getBatches()
      this.setLoading();
      if(res?.batches?.length) return res.batches;
    },
    setUUID(uuid) {
      return (this.uuid = uuid);
    },
    setAllowFreeOffers(allow_free_offers){
      this.allow_free_offers = allow_free_offers
    },
    async getProduct(id, offer = null, isBump = false, configs = {}, bumpOrder = 0 , batches = null) {

      const productStore = useProductStore();
      const { product, isValid } = storeToRefs(productStore);
      const { setProduct } = productStore;
      /* Get country */
      /* Set product url */
      let url = `/product/test-checkout/${id}`;
      // check if has custom checkout
      if (!!this.hasCustomCheckout && !isBump) {
        url += `/checkout/${this.hasCustomCheckout}`;
      }
      // Check if has offer
      if (offer) {
        url += `/offer/${offer}`;
      }
      // Check if has batches
      if(batches?.length){
        url += `/batches/[${batches}]`;
      }
      /* Set country in query */
      const query = {
        country: this.selectedCountry,
      };
      /* Call api to get product */
      try {
        return await useApi()
          .read(url, {
            ...configs,
            query,
          })
          .then(async (response) => {
            if(response.data.method.includes('CREDIT_CARD', 'TWO_CREDIT_CARDS')) {
              this.isCreditCard = true
            }

            if(this.global_settings.country !== 'BR') {
              this.redirectOfferPanel(response?.data, this.global_settings.country)
            }

            if (response.allow_free_offers){
              this.setAllowFreeOffers(response.allow_free_offers)
            }

            if (response?.checkout_payment?.data?.amount) {
              response.data.amount = response.checkout_payment.data.amount;
            }

            if (response?.checkout_payment?.paypal) {
              response.data.paypal = response.checkout_payment.paypal;
            }

            if (
              response.data.format === "PHYSICALPRODUCT" &&
              !!response.data.has_shipping_fee &&
              response.data.method !== 'FREE'
            ) {
              const shipping = { amount: undefined };
              if (response.data.type_shipping_fee === "FIXED") {
                shipping.amount = response.data.amount_fixed_shipping_fee;
              }
              response.data = { ...response.data, shipping };
            }

            if (
              !isBump &&
              response?.global_settings &&
              Array.isArray(response?.global_settings)
            ) {
              response.global_settings.forEach((item) => {
                if (item.key == "PAGARME_ANTIFRAUDE") {
                  this.global_settings.antifraud =
                    item.value == "ENABLED" ? true : false;
                }
                if (item.key == "MONTHLY_INTEREST") {
                  this.global_settings.monthly_interest = parseFloat(
                    item.value
                  );
                }
                if (item.key == "CHECKOUT_CAPTCHA") {
                  this.global_settings.captcha =
                    item.value == "ENABLED" ? true : false;
                }
              });
            }

            if (response?.data && !isBump) {
              this.checkoutPayment = response.checkout_payment;
              await setProduct(response.data, response.batches);
              if (!!this.hasCustomCheckout && isValid.value() && (product.method != 'FREE' || (product.method == 'FREE' && this.allow_free_offers != null && this.allow_free_offers !== 'DISABLED'))) {
                const customCheckout = useCustomCheckoutStore();
                customCheckout.setCustomCheckout(response.custom_checkout, response.purchase_notification);
              }
            } else {
              if(response?.data.status === "REQUESTED" || response?.data.status === "DISAPPROVED" || !response?.data.is_active){
                return;
              }

              let bumpData = {
                ...response.data,
                checkbox: false,
                b_order: bumpOrder,
              }

              if(this.hasBumpForceCheck) {
                bumpData.checkbox = true
                bumpData.disabled = true
                this.setProductList(bumpData);
              }

              this.bump_list.push(bumpData);
              this.bump_list = this.bump_list.sort((bump1, bump2) => {
                return bump1.b_order - bump2.b_order;
              });
            }

            if (response.data.product_type_id === 3 && response?.batches && Array.isArray(response?.batches)) {
              const preCheckout = usePreCheckoutStore();
              response.batches.forEach(batch => {
                if(haveAvailableTickets(batch)){
                  batch.soldOff = false;
                }else{
                  batch.soldOff = true;
                }
                // Adicionar chave para contabilizar ingressos selecionados
                batch.tickets = batch.tickets.map(x => {
                  return { ...x, selected_tickets: 0 }
                })
                // Ordenar ingressos
                batch.tickets.sort((a, b) => {
                  if (a.batch_order < b.batch_order) return -1;
                  if (a.batch_order > b.batch_order) return 1;
                  return 0;
                });
              })
              // Ordenar lotes
              response.batches.sort((a, b) => {
                if (a.order < b.order) return -1;
                if (a.order > b.order) return 1;
                return 0;
              });

              preCheckout.setBatches(response.batches);
            }

            return response
          })
          .catch((err) => {
            console.error(err);
            if (!isBump) throw err;
          });
      } catch (error) {
        console.error(error);
        if (!isBump) {
          this.setError("Ocorreu um erro ao processar a sua solicitação");
          this.global_settings.country = "BR";
        }
        this.setLoading();
      }
    },
    async getCoupon() {
      // NÃO APLICAR O CUPOM ATE VALIDAR ESSE CENÁRIO↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓
      const { batches } = usePreCheckoutStore();
      if(this.product_list.length && batches.length){
        const toast = Toast.useToast();
        toast.warning("Desculpe, o cupom não está disponível no momento para eventos.");
        throw new Error; 
      }
      // NÃO APLICAR O CUPOM ATE VALIDAR ESSE CENÁRIO↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑
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
        console.error(error);
        throw error;
      } finally {
        this.coupon.loading = false;
      }
    },
    async getBatches() {
      this.batches_list = [];
      // parse apenas dos params
      let searchParams = new URLSearchParams(this.url.query);
      // instancia o array final
      let batchesWithOffers = [];
      // regex para pegar ids dos batches
      let batcheRegex = new RegExp("(bt_id_)(\\d*$)", "i");
      // passamos uma vez apenas pegando o id dos lotes
      searchParams.forEach((value, key) => {
        let matches = key.match(batcheRegex);
        if (matches) {
          // caso esteja repetido, ignoramos
          if (!batchesWithOffers.find((item) => item.batche_id === value)) {
            // setamos o id do lote
            batchesWithOffers.push( value );
          }
        }
      });
      this.batches_list = batchesWithOffers;
    },
    async getBumps(isDonation = false) {
      if (!this.hasNewBump && !isDonation) {
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

      if(isDonation) {
        const productStore = useProductStore();
        const { product } = storeToRefs(productStore);
        const donation_offer = product?.value?.seller?.donation_offer
        let offer_hash = ''
        switch (donation_offer) {
          case 10:
            offer_hash = useRuntimeConfig().public.DONATION_RS.split(',')[1]
            break;
          case 20:
            offer_hash = useRuntimeConfig().public.DONATION_RS.split(',')[2]
            break;
          case 50:
            offer_hash = useRuntimeConfig().public.DONATION_RS.split(',')[3]
            break;
          case 100:
            offer_hash = useRuntimeConfig().public.DONATION_RS.split(',')[4]
            break;
          case 1000:
            offer_hash = useRuntimeConfig().public.DONATION_RS.split(',')[5]
            break;
        }

        bumpsWithOffers = [];
        bumpsWithOffers.push({
          bump_id: "1",
          product_id: "49124",
          offer_hash: offer_hash
        })
      }

      if (bumpsWithOffers.length) {
        this.products_client_statistics = [];
        bumpsWithOffers.forEach((bump,index) => {
          if (this.product_id !== bump.product_id)
            this.getProduct(
              bump.product_id,
              bump.offer_hash,
              true,
              {},
              Number(bump.bump_id),
            );
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
      const productStore = useProductStore();
      const { product } = storeToRefs(productStore);
      if(product.method === 'FREE') {
        this.setMethod("FREE");
      } else {
        if(allowed_methods.includes("CREDIT_CARD")) {
          this.setMethod("CREDIT_CARD");
        } else {
          this.setMethod(allowed_methods[0]);
        }
      }
    },
    setAmount(amount = 0) {
      this.amount = amount;
    },
    async setCoupon(initial = false, remove = false, routeIsCheckout = false) {
      if(routeIsCheckout) return;
      const store = useAmountStore();
      const prodStore = useProductStore();
      if (remove) {
        store.setAmount(store.getOriginalAmount - store.getAmount);
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
        if (["CREDIT_CARD", "TWO_CREDIT_CARDS"].includes(this.method)) {
          purchaseStore.setCardsAmount();
        }
        return;
      }
      if (!prodStore.allowedCoupon) return false;
      if (!!this.hasCoupon && initial) {
        this.coupon.name = this.hasCoupon;
      }
      if (!!this.coupon.name) {
        this.coupon.loading = true;

        await this.getCoupon()
          .then(({ amount, available, due_date }) => {
            this.coupon.amount = Math.abs(prodStore.amount - amount);
            this.coupon.available = available;
            this.coupon.due_date = due_date;
            this.coupon.discount = amount;
            store.setAmount(this.coupon.amount * -1);
            if (["CREDIT_CARD", "TWO_CREDIT_CARDS"].includes(this.method)) {
              purchaseStore.setCardsAmount();
            }

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
      if (ticket) this.ticket_installments = ticket;
    },
    setMethod(method = "") {
      this.method = method;

      const can_pay_in_installments = [
        "CREDIT_CARD",
        "TWO_CREDIT_CARDS",
        "BOLETO",
      ];
      if (!can_pay_in_installments.includes(this.method)) {
        this.setInstallments(1);
        return;
      }
      const store = useProductStore();

      this.setInstallments(
        store.hasPreSelectedInstallments ?? store.resolveInstallments(),
        store.product.max_installments ||
        store.product.max_subscription_installments ||
        12,
        store.hasFixedInstallments,
        store.hasTicketInstallments > 1 ? store.hasTicketInstallments : 1
      );
      /* credit card or two credit cards */
      if (["CREDIT_CARD", "TWO_CREDIT_CARDS"].includes(method)) {
        purchaseStore.setCardsAmount();
        return;
      }
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
    setProductListPreCheckout(product, addProduct = true) {
      const index = this.product_list.findIndex(item => item.id === product.id);

      if (addProduct) {
        amountStore.setAmount(
          !!product?.custom_charges?.length
            ? product.custom_charges[0].amount
            : product.amount
        );
        amountStore.setOriginalAmount(
          !!product?.custom_charges?.length
            ? product.custom_charges[0].amount
            : product.amount
        );

        if (
          product.format === "PHYSICALPRODUCT" &&
          !!product.has_shipping_fee &&
          product?.method !== 'FREE'
        ) {
          amountStore.setAmount(product?.shipping?.amount || 0);
          amountStore.setOriginalAmount(product?.shipping?.amount || 0);
        }
        this.checkAllowedMethods();
        this.product_list.push(product);
        return;
      }
      this.product_list.splice(index, 1);
      amountStore.setAmount(
        !!product.custom_charges?.length
          ? product.custom_charges[0].amount * -1
          : product.amount * -1
      );
      amountStore.setOriginalAmount(
        !!product.custom_charges?.length
          ? product.custom_charges[0].amount * -1
          : product.amount * -1
      );

      if (product.format === "PHYSICALPRODUCT" && !!product.has_shipping_fee && product?.method !== 'FREE') {
        amountStore.setAmount(product?.shipping?.amount * -1 || 0);
        amountStore.setOriginalAmount(product?.shipping?.amount * -1 || 0);
      }
      this.checkAllowedMethods();
    },
    setProductList(product) {
      const index = this.product_list
        .map((item) => item.id)
        .indexOf(product.id);

      if (index === -1) {
        amountStore.setAmount(
          !!product?.custom_charges?.length
            ? product.custom_charges[0].amount
            : product.amount
        );
        amountStore.setOriginalAmount(
          !!product?.custom_charges?.length
            ? product.custom_charges[0].amount
            : product.amount
        );

        if (
          product.format === "PHYSICALPRODUCT" &&
          !!product.has_shipping_fee &&
          product?.method !== 'FREE'
        ) {
          amountStore.setAmount(product?.shipping?.amount || 0);
          amountStore.setOriginalAmount(product?.shipping?.amount || 0);
        }
        this.checkAllowedMethods();
        this.product_list.push(product);
        return;
      }
      this.product_list.splice(index, 1);
      amountStore.setAmount(
        !!product.custom_charges?.length
          ? product.custom_charges[0].amount * -1
          : product.amount * -1
      );
      amountStore.setOriginalAmount(
        !!product.custom_charges?.length
          ? product.custom_charges[0].amount * -1
          : product.amount * -1
      );

      if (product.format === "PHYSICALPRODUCT" && !!product.has_shipping_fee && product?.method !== 'FREE') {
        amountStore.setAmount(product?.shipping?.amount * -1 || 0);
        amountStore.setOriginalAmount(product?.shipping?.amount * -1 || 0);
      }
      this.checkAllowedMethods();
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
          return await useApi()
            .read(`/sale-checkout/${id}`)
            .then((res) => {
              if (!!res) this.sales = res;
              return res;
            });
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
            !!offer
              ? `/product/${productId}/offer/${offer}`
              : `/product/${productId}`
          );
          if (!!productOffer) this.productOffer = productOffer;
        } catch (e) {
          this.setError(e.message);
          throw e;
        }
      }
    },
    async calculateShipping(zip) {
      if (zip) {
        try {
          const productStore = useProductStore();
          const { product } = storeToRefs(productStore);
          product.value.shipping_options = [];
          if (
            product.value.has_shipping_fee === 1 &&
            product.value.type_shipping_fee === "DYNAMIC"
          ) {
            let calculate = await useApi()
              .create(`envios/calculate/${this.product_id}`, {
                shipping_address_zip_code: zip
              })
              .then((res) => {
                this.hasIntegrationWithGreennEnvios = true;
                return res;
              })
              .catch((err) => {
                // Product does not have integration with "Greenn envios"
                if (err.value.statusCode) {
                  const toast = Toast.useToast();
                  toast.error("Esse produto não possui integração para envio");
                  this.hasIntegrationWithGreennEnvios = false;
                }
              });

            if (!!calculate) {
              calculate = calculate.filter((option) => !option?.error);
              this.deliveryOptions = calculate.sort(
                (a, b) => parseFloat(a.price) - parseFloat(b.price)
              );
              product.value.shipping_options = calculate.sort(
                (a, b) => parseFloat(a.price) - parseFloat(b.price)
              );

              this.setSelectedShipping(product.value.id, product.value.shipping_options[0]);
            }
          }

          await this.calculateBumpsShipping(zip);
        } catch (e) {
          await this.calculateBumpsShipping(zip);
        }
      }
    },
    async resetShipping() {
      this.deliveryOptions = {};
    },
    async changeBumpShippingAmount(id, amount) {
      const pdt = this.product_list.find((product) => product.id === id);
      if (pdt) {
        const oldAmount = pdt.shipping?.amount || 0;
        amountStore.setAmount(parseFloat(amount) - oldAmount);
        amountStore.setOriginalAmount(parseFloat(amount) - oldAmount);
        pdt.shipping = { ...pdt.shipping, amount: parseFloat(amount) };
      }
    },
    async calculateBumpsShipping(zip) {
      if (this.getBumpsWithShippingFee.length) {
        const promises = this.getBumpsWithShippingFee.map((bump) =>
          useApi()
            .create(`envios/calculate/${bump.id}`, {
              shipping_address_zip_code: zip,
            })
            .then((res) => {
              bump.hasIntegrationWithGreennEnvios = true;
              return res;
            })
            .catch((err) => {
              // Product does not have integration with "Greenn envios"
              if (err.value.statusCode) {
                const toast = Toast.useToast();
                toast.error("Esse produto não possui integração para envio");
                bump.hasIntegrationWithGreennEnvios = false;
              }
            })
        );
        const results = await Promise.all(promises);
        this.getBumpsWithShippingFee.forEach((bump, index) => {
          if (results[index]) {
            bump.shipping_options = results[index].sort(
              (a, b) => parseFloat(a.price) - parseFloat(b.price)
            );
          }
        });
      }
    },
    setSelectedShipping(product_id, shipping) {
      const product = this.product_list
        .filter((item) => item.id === parseInt(product_id))
        .pop();
      if (product.type_shipping_fee === "FIXED") {
        product.shipping_options = [];
        return;
      }
      // Remove shipping amount
      this.product_list.forEach((item) => {
        if (item.id === parseInt(product_id) && item.shipping?.amount) {
          amountStore.setAmount(parseFloat(item.shipping?.amount) * -1);
          amountStore.setOriginalAmount(parseFloat(item.shipping?.amount) * -1);
        }
      });
      // Set shipping infos in product
      this.product_list = this.product_list.map((item) => {
        if (item.id === parseInt(product_id)) {
          item.shipping = {
            amount: parseFloat(shipping.price),
            name: shipping.name,
            id: shipping.id,
          };
        }
        return item;
      });

      // Add shipping amount
      this.product_list.forEach((item) => {
        if (item.id === parseInt(product_id) && item.shipping?.amount) {
          amountStore.setAmount(parseFloat(item.shipping?.amount));
          amountStore.setOriginalAmount(parseFloat(item.shipping?.amount));
        }
      });

      this.shipping_selected = {
        frete_anterior: +shipping.price,
        service_name: shipping.name,
        old_amount: amountStore.getAmount,
        amount: +shipping.price,
        frete: shipping,
      };
    },
    redirectOfferPanel(product, country) {
      if(product.seller.is_heaven && product.seller.is_greenn && product.offer_redirect_id) {
        const urlAtual = new URL(window.location.href);
        const parametros = `/${product.offer_redirect.product_id}/offer/${product.offer_redirect.hash}`;
        const queryConcat = urlAtual.search ? '&' : '?';
        const queries = `${urlAtual.search}${queryConcat}country=${country}`
        const novaRota = useRuntimeConfig().public.HEAVEN_CHECKOUT_PAGE;
        const novaUrl = `${novaRota}${parametros}${queries}`;
        window.location.href = novaUrl;
      }
    }
  }
});
