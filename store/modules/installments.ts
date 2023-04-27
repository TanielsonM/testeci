// Types
import { InstallmentsState, Product } from "@/types";
// Core
import { storeToRefs } from "pinia";
// States
import { useCheckoutStore } from "../checkout";

export const useInstallmentsStore = defineStore("installments", {
  state: (): InstallmentsState => ({
    installments: [],
    maxInstallments: 0,
    minValue: 0,
  }),
  getters: {
    getInstallments(state: InstallmentsState) {
      const checkout = useCheckoutStore();
      const {
        amount,
        monthly_interest,
        product_list,
        product_id,
        coupon,
        installments,
      } = storeToRefs(checkout);
      return (n: number = installments.value) => {
        if (typeof n === "string") n = parseInt(n);
        let total = amount.value;

        if (n === 1) return total;
        else total = 0;
        let frete = 0;

        product_list.value.map((item: Product) => {
          let value = item.amount;
          // Verifica se produto tem frete
          if (!!item.has_shipping_fee) {
            frete +=
              item.type_shipping_fee === "FIXED"
                ? item.amount_fixed_shipping_fee
                : item.shipping?.amount || 0;
          }
          // Verifica se tem cupom
          if (item.id === parseInt(product_id.value) && coupon.value.applied) {
            value -= coupon.value.amount;
          }
          // Cliente não paga juros
          if (!!item.no_interest_installments) {
            total += value;
          }
          // Cliente paga juros
          else {
            let i = parseFloat(monthly_interest.value) / 100;
            total +=
              (value * n) /
              ((Math.pow(i + 1, n) - 1) / (Math.pow(i + 1, n) * i));
          }
        });
        return (total + frete) / n;
      };
    },
  },
  actions: {},
});
