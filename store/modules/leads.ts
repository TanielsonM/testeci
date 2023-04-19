import { formatMoney } from "~~/utils/money";
import { leadsState } from "@/types";

export const useLeadsStore = definePiniaStore("leads", {
  state: (): leadsState => ({
    personal: [],
    address: [],
    purchase: [],
  }),
  getters: {},
  actions: {
    async getInstallments(): Promise<void> {
      await useApi()
        .read("/installments/", { params })
        .then((res: InstallmentsState) => {
          this.installments = res.installments;
          this.maxInstallments = res.maxInstallments;
        });
    },
  },
  persist: true,
});
