import { formatMoney } from "~~/utils/money";
import { InstallmentsState } from "@/types";

export const useInstallmentsStore = definePiniaStore("installments", {
  state: (): InstallmentsState => ({
    installments: [],
    maxInstallments: 0,
    minValue: 0,
  }),
  getters: {},
  actions: {
    /**
     * @returns {void}
     */
    async getInstallments(): Promise<void> {
      try {
        const params = {
          maxInstallments: 12,
          values: [
            20, // Valor do produto principal
            // Valor dos bumps caso existam
            18,
          ],
        };

        await useApi()
          .read("/installments/", { params })
          .then((res: InstallmentsState) => {
            this.installments = res.installments;
            this.maxInstallments = res.maxInstallments;
          });
      } catch (error) {}
    },
  },
});
