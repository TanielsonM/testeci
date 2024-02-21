<script setup>
import { storeToRefs } from "pinia";
import { useCustomCheckoutStore } from "~~/store/customCheckout";
import { useAmountStore } from "~~/store/modules/amount";

const custom_checkout = useCustomCheckoutStore();
const amountStore = useAmountStore();
const { amount } = storeToRefs(amountStore);
const theme = custom_checkout.theme;
</script>

<template>
  <div class="block justify-between items-center mb-5 sm:flex">
    <div class="px-3 pt-1 bg-main-transparent rounded-lg w-fit">
      <h4 class="mb-[5px] text-[18px] font-[700] text-main-color">
        {{ formatMoney(amount) }}
      </h4>
    </div>
  </div>
</template>