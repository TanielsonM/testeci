import { AmountState } from "~~/types";

export const useAmountStore = definePiniaStore("Amount", {
  state: (): AmountState => ({
    amount: 0,
    originalAmount: 0,
  }),
  getters: {
    getAmount: (state) => state.amount,
    getOriginalAmount: (state) => state.originalAmount,
  },
  actions: {
    setAmount(value: number) {
      this.amount += value;
    },
    setOriginalAmount(value: number) {
      this.originalAmount += value;
    },
  },
});
