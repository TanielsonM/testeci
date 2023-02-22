export const useProductStore = definePiniaStore("product", {
  state: () => ({
    product: null,
    amount: 0,
    original_amount: 0,
    methods: null,
    method: null,
  }),
  getters: {
    product_id: (state) => state.product.id,
    isSubscription: (state) => state.product.type === "SUBSCRIPTION",
    isValid: (state) =>
      state.product.state_offer === "APPROVED" &&
      state.product.state_product === "APPROVED" &&
      state.product.is_active,
  },
  actions: {
    setProduct(product) {
      this.product = product;
      this.amount = product.amount;
      this.original_amount = product.amount;
      this.methods = product.method.split(",");
      this.method = this.methods[0];
    },
  },
});
