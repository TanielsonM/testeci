import { defineStore } from "pinia";

export const useGoBackToPrecheckoutStore = defineStore("goBackToPrecheckout", {
  state: () => ({
    showModal: false
  }),
  getters: {
    getShowModal: (state) => state.showModal
  },
  actions: {
    setShowModal(showModal: boolean) {
      this.showModal = showModal;
    }
  }
});
