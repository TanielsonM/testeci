<script setup>
import { useProductStore } from "~~/store/product";
const { product } = useProductStore();
</script>

<template>
  <div class="w-full flex justify-center">
    <img class="rounded-[20px] max-h-[354px]" :src="product.images[0].path" alt="event_img">
  </div>
</template>