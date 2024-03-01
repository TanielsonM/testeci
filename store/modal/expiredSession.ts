import { defineStore } from "pinia";

export const useExpiredSessionStore = defineStore("expiredSession", {
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
