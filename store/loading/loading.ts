export const useLoadingStore = defineStore("loading", {
  state: () => ({
    isLoading: false,
  }),
  getters: {},
  actions: {
    changeLoading() {
      this.isLoading = !this.isLoading;
    },
  },
});
