<script setup>
import { storeToRefs } from "pinia";
import { useCustomCheckoutStore } from "~~/store/customCheckout";
import { useAmountStore } from "~~/store/modules/amount";
import { useCheckoutStore } from "~~/store/checkout";

const custom_checkout = useCustomCheckoutStore();
const amountStore = useAmountStore();
const checkout = useCheckoutStore();
const { amount } = storeToRefs(amountStore);
const theme = custom_checkout.theme;
</script>

<template>
  <div class="block justify-between items-center mb-5 sm:flex">
    <div
      v-if="checkout.getIsCreditCard"
      class="flex items-center px-3 bg-[#F7F7F7] rounded-lg w-fit mb-3 sm:mb-0"
      :class="{
        'bg-[#F7F7F7]': theme === 'light',
        'bg-txt-color': theme === 'dark'
      }"
    >
      <img
        class="mr-2"
        src="@/assets/icons/credit_card.svg"
        alt="credit_card_icon"
      />
      <h4 class="mb-[5px] mt-1 text-[14px] font-[600] text-black">
        Parcele sua compra em até 12x
      </h4>
    </div>
    <div class="px-3 pt-1 bg-main-transparent rounded-lg w-fit">
      <h4 class="mb-[5px] text-[18px] font-[700] text-main-color">
        {{ formatMoney(amount) }}
      </h4>
    </div>
  </div>
</template>