<script setup>
import { useCustomCheckoutStore } from "~~/store/customCheckout";

const custom_checkout = useCustomCheckoutStore();
const theme = custom_checkout.theme;
</script>

<template>
  <div
    class="flex justify-between items-center p-5 mb-8 rounded-lg"
    :class="{
      'bg-[#F7F7F7]': theme === 'light',
      'bg-txt-color': theme === 'dark'
    }"
  >
    <span class="text-[16px] font-[600] text-black">Compartilhar</span>
    <div class="flex">
      <Icon
        name="mdi:whatsapp"
        class="mr-5 cursor-pointer hover:scale-110"
        size="22"
      />
      <img
        class="mr-5 cursor-pointer hover:scale-110"
        width="20"
        src="@/assets/icons/facebook.svg"
        alt="facebook"
      />
      <img
        class="cursor-pointer hover:scale-110"
        width="20"
        src="@/assets/icons/twitter.svg"
        alt="twitter"
      />
    </div>
  </div>
</template>