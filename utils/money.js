import { useCheckoutStore } from "@/store/checkout";

export function formatMoney(amount) {
  if (!amount) return amount;
  const store = useCheckoutStore();
  return `${
    store.checkoutPayment?.data.symbol_currency || "R$"
  } ${amount.toLocaleString("pt-BR", {
    minimumFractionDigits: 2,
  })}`;
}
