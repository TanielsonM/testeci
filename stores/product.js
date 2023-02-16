export const useProductStore = definePiniaStore("product", {
  state: () => ({
    product: null,
    amount: 0, 
    original_amount: 0,
    methods: null
  }),
  getters: {
    product_id: (state) => state.product.id,
  },
  actions: {
    setProduct(product) {
      this.product = product;
      this.amount = product.amount;
      this.original_amount = product.amount;
      this.method = product.method
    },
  },
});
