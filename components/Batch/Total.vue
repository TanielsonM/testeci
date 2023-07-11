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
  <div>
    <small class="text-gray-400">Total</small>
    <p class="text-3xl text-input-color font-bold">{{ formatMoney(amount) }}</p>
    <small class="text-main-color">ou {{ installments }}x de {{ formatMoney(getInstallments()) }}</small>
  </div>
</template>