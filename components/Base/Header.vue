<script setup>
import { useCustomCheckoutStore } from "~~/store/customCheckout";
import { useCheckoutStore } from "~~/store/checkout";
import { useProductStore } from "~~/store/product";
import greenn from "../../assets/logos/logo.png";
import heaven from "../../assets/heaven/logo.svg";

const custom_checkout = useCustomCheckoutStore();
const checkout = useCheckoutStore();
const product = useProductStore();
</script>

<template>
  <Scarcity v-if="product.isValid()" />
  <header
    v-if="custom_checkout.topThumb && product.isValid()"
    class="-mt-8 flex max-h-[40vh] w-full items-center justify-center"
  >
    <img :src="custom_checkout.topThumb" alt="Thumb superior" />
  </header>
  <header
    v-if="
      !custom_checkout.hasScarcity &&
      !custom_checkout.topThumb &&
      product.isValid()
    "
    class="sticky top-0 z-50 flex min-h-[60px] w-full items-center bg-checkout px-4 shadow-lg"
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
