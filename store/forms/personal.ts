export const usePersonalStore = definePiniaStore("personal", {
  state: () => ({
    name: "",
    email: "",
    cellphone: "",
    document: "",
  }),

  getters: {},
  actions: {},
});
