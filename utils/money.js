import { useCheckoutStore } from "@/store/checkout";

export function formatMoney(amount) {
  if (!amount) return amount;
  const store = useCheckoutStore();
  return `${store.checkoutPayment.data.symbol_currency} ${amount.toLocaleString(
    "pt-BR",
    {
      maximumFractionDigits: 2,
      minimumFractionDigits: 2,
    }
  )}`;
}
