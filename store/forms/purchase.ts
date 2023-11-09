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

      const { installments, method } = storeToRefs(chekStore);

      if (method.value === "TWO_CREDIT_CARDS") {
        this.first.amount = formatMoney(
          instStore.getTotal() / 2
        );
        this.second.amount = formatMoney(
          instStore.getTotal() / 2
        );
        return;
      }
      this.first.amount = instStore.getTotal();
    },
  },
});
