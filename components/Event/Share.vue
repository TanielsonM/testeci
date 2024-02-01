<script setup>
import { useCustomCheckoutStore } from "~~/store/customCheckout";
import { useCheckoutStore } from "~~/store/checkout";

const checkout = useCheckoutStore();
const custom_checkout = useCustomCheckoutStore();
const theme = custom_checkout.theme;
const config = useRuntimeConfig();

const link = config.public.CHECKOUT_PAGE + '/pre-checkout/' + checkout.url.params.product_id

const openWhatsapp = () => {
  window.open(
    `https://api.whatsapp.com/send?text=${link}`,
    "blank"
  );
};

const openFacebook = () => {
  window.open(
    `https://www.facebook.com/sharer/sharer.php?u=${link}`,
    "blank"
  );
};

const openTwitter = () => {
  window.open(
    `https://twitter.com/intent/tweet?text=${link}`,
    "blank"
  );
};
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
        @click="openWhatsapp"
      />
      <img
        class="mr-5 cursor-pointer hover:scale-110"
        width="20"
        src="@/assets/icons/facebook.svg"
        alt="facebook"
        @click="openFacebook"
      />
      <img
        class="cursor-pointer hover:scale-110"
        width="20"
        src="@/assets/icons/twitter.svg"
        alt="twitter"
        @click="openTwitter"
      />
    </div>
  </div>
</template>