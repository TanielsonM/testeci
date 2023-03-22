<script setup>
import { storeToRefs } from "pinia";
import { useCheckoutStore } from "@/store/checkout";
import { useProductStore } from "@/store/product";

const product = useProductStore();
const checkout = useCheckoutStore();
const { ticket_installments, getInstallments } = storeToRefs(checkout);
const { hasTicketInstallments, productType } = storeToRefs(product);

const showInstallments = computed(() => {
  return productType.value === "TRANSACTION" && hasTicketInstallments.value > 1;
});
</script>

<template>
  <p class="text-txt-color text-[13px] font-normal">
    Pagamentos com Boleto Bancário levam até 3 dias úteis para serem compensados
    e então terem os produtos liberados.
  </p>
  <BaseSelect
    label="Parcelas do boleto"
    class="w-1/2"
    v-model="ticket_installments"
    v-if="showInstallments"
  >
    <!-- Installments -->
    <option
      v-for="(d, index) in hasTicketInstallments"
      :key="index"
      :value="index + 1"
      class="hover:bg-main-color cursor-pointer select-none rounded"
    >
      {{
        index + 1 > 1
          ? `${index + 1}x ${$t("order.de")} ${formatMoney(
              getInstallments(index + 1)
            )}*`
          : `${index + 1}x ${$t("order.de")} ${formatMoney(getInstallments(1))}`
      }}
    </option>
  </BaseSelect>
</template>
