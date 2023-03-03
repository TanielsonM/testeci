<script setup>
import { useCustomCheckoutStore } from "~~/store/customCheckout";
import { useCheckoutStore } from "~~/store/checkout";
import greenn from "../../assets/logos/logo.png";
import heaven from "../../assets/heaven/logo.svg";

const custom_checkout = useCustomCheckoutStore();
const checkout = useCheckoutStore();
</script>

<template>
  <Scarcity />
  <header
    v-if="custom_checkout.topThumb"
    class="-mt-8 flex max-h-[40vh] w-screen items-center justify-center"
  >
    <img :src="custom_checkout.topThumb" alt="Thumb superior" />
  </header>
  <header
    v-if="!custom_checkout.hasScarcity || !custom_checkout.topThumb"
    class="bg-checkout sticky top-0 z-50 flex min-h-[60px] w-screen items-center px-4 shadow-lg"
  >
    <img
      :src="
        custom_checkout.customLogotipo
          ? custom_checkout.customLogotipo
          : checkout.isHeaven
          ? heaven
          : greenn
      "
      alt="Logo da pagina"
      class="max-h-10 max-w-[100px]"
      width="100"
      height="40"
    />
  </header>
</template>
