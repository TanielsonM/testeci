<script setup>
import { useCustomCheckoutStore } from "~~/store/customCheckout";
import { useProductStore } from "~~/store/product";
import greenn from "../../assets/logos/logo.png";
import heaven from "../../assets/heaven/logo.svg";

const customCheckStore = useCustomCheckoutStore();
const product = useProductStore();

const { topThumb, hasScarcity, hasCustomLogo } = storeToRefs(customCheckStore);
</script>

<template>
  <Scarcity v-if="product.isValid()" />
  <header
    v-if="topThumb && product.isValid()"
    class="-mt-8 flex max-h-[40vh] w-full items-center justify-center"
  >
    <img :src="topThumb" alt="Thumb superior" />
  </header>
  <header
    v-if="!hasScarcity && !topThumb && product.isValid()"
    class="sticky top-0 z-50 flex min-h-[60px] w-full items-center bg-checkout px-4 shadow-lg"
  >
    <img
      :src="hasCustomLogo ? hasCustomLogo : greenn"
      alt="Logo da pagina"
      class="max-h-10 max-w-[100px] object-contain"
      width="100"
      height="40"
    />
  </header>
</template>
