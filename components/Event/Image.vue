<script setup>
import { useProductStore } from "~~/store/product";
const { product } = useProductStore();
</script>

<template>
  <div class="w-full flex justify-center">
    <img class="rounded max-h-[200px]" :src="product.images[0].path" alt="event_img">
  </div>
</template>