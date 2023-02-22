export const useProductsStore = definePiniaStore("products", {
  state: () => ({
    list: [],
  }),
  getters: {},
  actions: {
    addProduct(product) {
      this.list.push(product);
    },
    removeProduct(product) {},
  },
});
