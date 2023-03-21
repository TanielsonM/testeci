<script setup>
// Utils
import { formatMoney } from "~~/utils/money";
// Stores
import { storeToRefs } from "pinia";
import { useCheckoutStore } from "@/store/checkout";
import { useProductStore } from "@/store/product";

const checkout = useCheckoutStore();
const product = useProductStore();
const {
  getInstallments,
  method,
  installments,
  hasFees,
  coupon,
  original_amount,
  checkoutPayment,
} = storeToRefs(checkout);

/* computeds */
const amountText = computed(() => {
  switch (method.value) {
    case "CREDIT_CARD":
      return `${installments.value}x de ${formatMoney(
        getInstallments.value()
      )} ${hasFees.value ? "(Sem juros)" : ""}`;
    default:
      return `${formatMoney(getInstallments.value(1))}`;
  }
});
</script>

<template>
  <p v-if="coupon.applied" class="text-[13px] text-[#81858e] line-through">
    {{ formatMoney(original_amount) }}
  </p>
  <small v-if="installments < 2" class="d-block small-text">
    {{ $t("order.vc_pagara") }}
  </small>
  <p class="text-txt-color text-lg font-semibold">
    {{ amountText }}
  </p>
  <small
    v-if="
      installments > 1 &&
      !product.hasFixedInstallments &&
      !product.hasPreSelectedInstallments
    "
    class="small-text"
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
</template>
