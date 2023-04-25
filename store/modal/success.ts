export const useModalStore = defineStore("modal", {
  state: () => ({
    title: "",
    expiredPix: false,
    closeAtion: () => {},
  }),
  getters: {},
  actions: {
    setTitle(title: string) {
      this.title = title;
    },
    setExpiredPix(isExpired: boolean) {
      this.expiredPix = isExpired;
    },
    setAction(action: () => void) {
      this.closeAtion = action;
    },
  },
});
