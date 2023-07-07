export const useExpiredSessionStore = defineStore("modal", {
  state: () => ({
    haveFinished: false
  }),
  getters: {
    getHaveFinished: (state) => state.haveFinished
  },
  actions: {
    setHaveFinished(haveFinished: boolean) {
      this.haveFinished = haveFinished;
    }
  }
});
