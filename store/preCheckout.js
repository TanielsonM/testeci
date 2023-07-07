import { useCheckoutStore } from "~/store/checkout.js";

export const usePreCheckoutStore = defineStore("preCheckout", {
  state: () => ({
    batchs_list: null
  }),
  getters: {
    getBatchsList: (state) => state.batchs_list
  },
  actions: {
    setBatchsList(state, value) {
      state.batchs_list = value;
    }
  }
});
