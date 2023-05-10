export const useLoadingStore = defineStore("loading", {
  state: () => ({
    isLoading: false,
    current: "",
  }),
  getters: {},
  actions: {
    changeLoading(route = "") {
      this.isLoading = !this.isLoading;
      this.current = route;
    },
  },
});
