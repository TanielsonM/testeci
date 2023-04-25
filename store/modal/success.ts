export const useModalStore = defineStore("modal", {
  state: () => ({
    title: "",
    expiredPix: false,
    closeAtion: () => {},
    iframe: "https://greenn.com.br/checkout-obrigado",
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
    setIframe(url?: string) {
      if (!!url) this.iframe = url;
    },
  },
});
