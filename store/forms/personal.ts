export const usePersonalStore = defineStore("personal", {
  state: () => ({
    name: "",
    email: "",
    confirmEmail: "",
    cellphone: "",
    document: "",
    validPhone: false,
  }),

  getters: {},
  actions: {},
});
