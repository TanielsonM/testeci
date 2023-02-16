<script setup>
import { useCustomCheckoutStore } from "~~/stores/customCheckout";
import logo from "../../assets/logos/logo.png";

const custom_checkout = useCustomCheckoutStore();
</script>

<template>
  <Scarcity />
  <header
    v-if="custom_checkout.topThumb"
    class="w-screen max-h-[40vh] flex items-center justify-center -mt-8"
  >
    <img :src="custom_checkout.topThumb" alt="Thumb superior" />
  </header>
  <header
    v-if="!custom_checkout.hasScarcity || !custom_checkout.topThumb"
    class="
      w-screen
      min-h-[60px]
      bg-checkout
      shadow-lg
      flex
      items-center
      px-4
      sticky
      top-0
    "
  >
    <img
      :src="
        custom_checkout.customLogotipo ? custom_checkout.customLogotipo : logo
      "
      alt="Logo da pagina"
      class="max-h-10 max-w-[100px]"
      width="100"
      height="40"
    />
  </header>
</template>