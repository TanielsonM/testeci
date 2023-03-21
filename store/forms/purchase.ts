export const usePurchaseStore = definePiniaStore("purchase", {
  state: () => ({
    first: {
      amount: 0,
      number: "",
      holder_name: "",
      month: "",
      year: "",
      cvv: "",
    },
    second: {
      amount: 0,
      number: "",
      holder_name: "",
      month: "",
      year: "",
      cvv: "",
    },
  }),
  getters: {},
  actions: {},
});
