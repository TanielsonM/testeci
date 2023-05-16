<script setup>
// Utils
import { formatMoney } from "~~/utils/money";
// Stores
import { storeToRefs } from "pinia";
import { useCheckoutStore } from "@/store/checkout";
import { useProductStore } from "@/store/product";
import { useInstallmentsStore } from "~~/store/modules/installments";
import { useAmountStore } from "~~/store/modules/amount";

const checkout = useCheckoutStore();
const product = useProductStore();
const amountStore = useAmountStore();
const installmentsStore = useInstallmentsStore();
const {
  method,
  installments,
  hasFees,
  coupon,
  checkoutPayment,
  ticket_installments,
} = storeToRefs(checkout);

const { getInstallments } = storeToRefs(installmentsStore);
const { hasTicketInstallments } = storeToRefs(product);

function formatAmountText(installments = 1) {
  return `${installments}x de ${formatMoney(
    getInstallments.value(installments)
  )} ${hasFees.value ? "" : "(Sem juros)"}`;
}

/* computeds */
const amountText = computed(() => {
  if (method.value === "BOLETO" && hasTicketInstallments.value > 1) {
    return formatAmountText(ticket_installments.value);
  }

  if (["CREDIT_CARD", "TWO_CREDIT_CARDS"].includes(method.value)) {
    return formatAmountText(installments.value);
  }

  return `${formatMoney(getInstallments.value(1))}`;
});
</script>

<template>
  <ClientOnly>
    <template #fallback>
      <LoadingShimmer width="150px" height="30px" />
      <LoadingShimmer width="120px" height="20px" />
    </template>
    <p v-if="coupon.applied" class="text-[13px] text-[#81858e] line-through">
      {{ formatMoney(amountStore.getOriginalAmount) }}
    </p>
    <small v-if="installments < 2" class="d-block small-text leading-4">
      {{ $t("order.vc_pagara") }}
    </small>
    <p class="text-lg font-semibold leading-4 text-txt-color">
      {{ amountText }}
    </p>
    <small
      v-if="
        installments > 1 &&
        !product.hasFixedInstallments &&
        !product.hasPreSelectedInstallments
      "
      class="small-text leading-4"
    >
      {{ $t("order.a_vista") }}
      {{ formatMoney(getInstallments(1)) }}
      <br />
      {{
        checkoutPayment &&
        checkoutPayment.price &&
        checkoutPayment.price.payable_tax
          ? $t("order.impostos")
          : ""
      }}
    </small>
  </ClientOnly>
</template>
