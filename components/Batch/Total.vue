<script setup>
import { useAmountStore } from "~~/store/modules/amount";
import { useInstallmentsStore } from "~~/store/modules/installments";
import { useCheckoutStore } from "~~/store/checkout";

const amountStore = useAmountStore();
const installmentsStore = useInstallmentsStore();
const checkout = useCheckoutStore();

const { amount } = storeToRefs(amountStore);
const { getInstallments } = storeToRefs(installmentsStore);
const { installments } = storeToRefs(checkout);
</script>

<template>
  <div class="mb-5 md:mb-0">
    <p class="text-[14px] font-[400] text-[#81858E]">{{ $t("pre_checkout.total") }}</p>
    <p class="text-[24px] font-[700] text-input-color">{{ formatMoney(amount) }}</p>
    <p v-if="amount > 0" class="text-[14px] font-[400] text-main-color">
      {{ $t("pre_checkout.or") }} {{ installments }}x de {{ formatMoney(getInstallments()) }}
    </p>
  </div>
</template>