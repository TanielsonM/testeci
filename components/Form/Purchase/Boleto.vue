<script setup>
import { storeToRefs } from "pinia";
import { useCheckoutStore } from "@/store/checkout";
import { useProductStore } from "@/store/product";
import { useInstallmentsStore } from "~~/store/modules/installments";

const product = useProductStore();
const checkout = useCheckoutStore();
const installments = useInstallmentsStore();
const { getInstallments } = storeToRefs(installments);
const { ticket_installments } = storeToRefs(checkout);
const { hasTicketInstallments, productType } = storeToRefs(product);

const showInstallments = computed(() => {
  return productType.value === "TRANSACTION" && hasTicketInstallments.value > 1;
});
</script>

<template>
  <section class="flex flex-col gap-5">
    <p class="text-[13px] font-normal text-txt-color">
      Pagamentos com Boleto Bancário levam até 3 dias úteis para serem
      compensados e então terem os produtos liberados.
    </p>
    <ClientOnly>
      <template #fallback>
        <LoadingShimmer width="50%" height="55px" />
      </template>
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
          class="cursor-pointer select-none rounded hover:bg-main-color"
        >
          {{
            index + 1 > 1
              ? `${index + 1}x ${$t("order.de")} ${formatMoney(
                  getInstallments(index + 1)
                )}*`
              : `${index + 1}x ${$t("order.de")} ${formatMoney(
                  getInstallments(1)
                )}`
          }}
        </option>
      </BaseSelect>
    </ClientOnly>
  </section>
</template>
