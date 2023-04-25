export const useModalStore = defineStore("modal", {
  state: () => ({
    title: "",
    expiredPix: false,
  }),
  getters: {},
  actions: {
    setTitle(title: string) {
      this.title = title;
    },
    setExpiredPix(isExpired: boolean) {
      this.expiredPix = isExpired;
    },
  },
});
