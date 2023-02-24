export function formatMoney(amount) {
  const cookie = useCookie("locale");
  let localeFormat = computed(
    () => `${cookie.value?.language}-${cookie.value?.sigla}` || "pt-BR"
  );
  let currency = computed(() => cookie.value?.currency || "BRL");
  return new Intl.NumberFormat(localeFormat, {
    style: "currency",
    currency: currency.value,
  }).format(amount);
}
