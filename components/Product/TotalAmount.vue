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
const productStore = useProductStore();
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
const {
  hasTicketInstallments,
  hasFixedInstallments,
  hasPreSelectedInstallments,
  product
} = storeToRefs(productStore);

function formatAmountText(installments = 1) {
  return `${installments}x de ${formatMoney(
    getInstallments.value(installments)
  )} ${hasFees.value ? "" : "(Sem juros)"}`;
}

/* computeds */
const amountText = computed(() => {
  if (
    method.value === "BOLETO" &&
    hasTicketInstallments.value > 1 &&
    ticket_installments.value > 1
  ) {
    return formatAmountText(ticket_installments.value);
  }

  if (["CREDIT_CARD", "TWO_CREDIT_CARDS"].includes(method.value)) {
    return formatAmountText(installments.value);
  }

  return `${formatMoney(getInstallments.value(1))}`;
});

const showInCashText = computed(() => {
  if (method.value === "BOLETO") {
    if (hasTicketInstallments.value > 1 && ticket_installments.value > 1) {
      return true;
    }
    return false;
  }
  return (
    installments.value > 1 &&
    !hasFixedInstallments.value &&
    !hasPreSelectedInstallments.value
  );
});
</script>

<template>
  <ClientOnly>
    <template v-if="product?.method === 'FREE'">
      {{ $t('order.gratis') }}
    </template>
    <template v-else>
      <p v-if="coupon.applied" class="text-[13px] text-[#81858e] line-through">
        {{ formatMoney(amountStore.getOriginalAmount) }}
      </p>
      <small
        v-if="
          installments < 2 ||
          (method == 'BOLETO' &&
            (hasTicketInstallments < 2 || ticket_installments == 1))
        "
        class="d-block small-text"
      >
        {{ $t("order.vc_pagara") }}
      </small>
      <p class="text-lg font-semibold leading-4 text-txt-color">
        {{ amountText }}
      </p>
      <small v-if="showInCashText" class="small-text leading-4">
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
    </template>
  </ClientOnly>
</template>
