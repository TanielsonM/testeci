import { formatMoney } from "@/utils/money";
import { useInstallmentsStore } from "../modules/installments";

export const usePurchaseStore = defineStore("purchase", {
  state: () => ({
    first: {
      amount: 0,
      number: "",
      holder_name: "",
      month: "",
      year: "",
      cvv: "",
    },
    second: {
      amount: 0,
      number: "",
      holder_name: "",
      month: "",
      year: "",
      cvv: "",
    },
  }),
  getters: {},
  actions: {
    setCardsAmount() {
      const instStore = useInstallmentsStore();
      const chekStore = useCheckoutStore();

      const { method } = storeToRefs(chekStore);

      if (method.value === "TWO_CREDIT_CARDS") {
        const firstRound = Math.round((instStore.getTotal() / 2) * 100) / 100
        this.first.amount = formatMoney(firstRound);
        this.second.amount = formatMoney(instStore.getTotal() - firstRound);
        return;
      }
      this.first.amount = instStore.getTotal();
    },
  },
});
