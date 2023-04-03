import { formatMoney } from "~~/utils/money";
import * as Types from "@/types";

export const useInstallmentsStore = definePiniaStore("installments", {
  state: (): Types.InstallmentsState => ({
    installments: [],
    maxInstallments: 0,
    minValue: 0,
  }),
  getters: {},
  actions: {
    async getInstallments(
      productId: number,
      offer: string | null
    ): Promise<void> {
      try {
        let query = new URLSearchParams();
        if (!!offer) query.set("offer", offer);

        await useApi()
          .read(`/installments/${productId}`, { query })
          .then((res: Types.InstallmentsState) => {
            this.installments = res.installments;
            this.maxInstallments = res.maxInstallments;
          });
      } catch (error) {}
    },
  },
});
