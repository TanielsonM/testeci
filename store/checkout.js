import { useCustomCheckoutStore } from "~/store/customCheckout";
import { useProductStore } from "~/store/product";

export const useCheckoutStore = definePiniaStore("checkout", {
  state: () => ({
    global_loading: true,
    global_settings: {
      captcha: null,
      antifraud: null,
      monthly_interest: null,
      country: "br",
    },
    url: {
      params: null,
      query: null,
      fullPath: "",
    },
    /* Methods */
    allowed_methods: null,
    method: null,
    /* Installments */
    installments: null,
    max_installments: null,
    fixed_installments: null,
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
      available: null,
      discount: 0,
      due_date: null,
      error: null,
      is_valid: false,
      loading: false,
      name: "",
    },
  }),
  getters: {
    isLoading: (state) => state.global_loading,
    /**
     * Query getters
     */
    hasBusiness: (state) => state.url.query?.b, // Jivochat
    hasBump: (state) => state.url.fullPath.includes("b_id"),
    hasCoupon: (state) => state.url.query?.cupom ?? "",
    hasCustomCheckout: (state) => state.url.query?.ch_id,
    hasDocument: (state) => state.url.query?.document,
    hasDebugPixel: (state) => state.url.query?.debugPixel === "true",
    hasEmail: (state) => state.url.query?.em,
    hasForce: (state) => state.url.query?.force === "true",
    hasPhone: (state) => state.url.query?.ph,
    hasUpsell: (state) => state.url.query?.up_id,
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
    /**
     * Juros
     */
    hasFees: (state) => {
      const product = useProductStore();
      return state.method === "CREDIT_CARD" ? product.hasFees : false;
    },
    /**
     * Installments
     */
    getInstallments(state) {
      return (installments = state.installments) => {
        let amount = this.amount;
        const product = useProductStore();
        if (installments === 1) {
          return !product.isPhysicalProduct ? state.amount : state.amount + 592;
        }
        if (
          this.hasFees &&
          ["CREDIT_CARD", "TWO_CREDIT_CARD"].includes(state.method)
        ) {
          amount = state.amount / installments;
          return amount;
        } else {
          let tax = this.monthly_interest / 100; // tax per month
          amount =
            amount /
            ((Math.pow(1 + tax, installments) - 1) /
              (Math.pow(1 + tax, installments) * tax));
        }
        return amount;
      };
    },
  },
  actions: {
    async init() {
      this.setLoading(true);
      await this.getGlobalSettings();

      const { params, query, fullPath } = useRoute();
      this.url.params = params;
      this.url.query = query;
      this.url.fullPath = fullPath;
      await this.getProduct(this.product_id, this.product_offer);

      /* Initial configs */
      this.setJivochat();
      this.setCoupon(true);

      setTimeout(() => {
        this.setLoading();
      }, 1000);
    },
    async getCoupon() {
      const url = `/coupon/check/${this.coupon.name.toUpperCase()}/${
        this.url.params.product_id
      }`;

      if (this.url.params.hash) {
        url = url + `/offer/${this.$route.params.hash}`;
      }
      try {
        const res = await useApi(url, "get");
        return res;
      } catch (error) {
        this.coupon.error = error;
      } finally {
        this.coupon.loading = false;
      }
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
    async getProduct(id, offer = null, isBump = false) {
      const cookie = useCookie("locale");
      await useGetProduct(id, offer, cookie.value?.sigla);
    },
    setAllowedMethods(allowed_methods = []) {
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
    async setCoupon(initial = false) {
      if (!!this.hasCoupon) {
        this.coupon.name = this.hasCoupon;
      }
      if (!!this.coupon.name) {
        this.coupon.loading = true;
        const store = useProductStore();
        const current_amount = this.amount;

        const { amount, available, due_date } = await this.getCoupon();

        this.coupon.amount = Math.abs(store.product.amount - amount);
        this.coupon.available = available;
        this.coupon.due_date = due_date;
        this.coupon.discount = amount;

        this.setAmount(this.amount - this.coupon.amount);

        this.coupon.error = false;
        this.coupon.applied = true;
        this.coupon.is_valid = true;
      }
    },
    setInstallments(installments = null, maxInstallments = null, fixed = null) {
      this.installments = fixed ?? installments ?? 1;
      if (maxInstallments) this.max_installments = maxInstallments;
      if (fixed) this.fixed_installments = fixed;
    },
    setJivochat(id = "J0jlVX87X9") {
      const custom_checkout = useCustomCheckoutStore();
      if (this.hasBusiness || custom_checkout.hasJivochatId) {
        const jivoScript = document.createElement("script");
        jivoScript.src = `//code-eu1.jivosite.com/widget/${id}`;
        jivoScript.async = true;
        document.head.appendChild(jivoScript);
      }
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
  },
});
