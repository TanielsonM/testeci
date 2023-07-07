<script setup>
import { useProductStore } from "~~/store/product";
const { product } = useProductStore();
</script>

<template>
  <p class="text-justify text-sm font-normal leading-relaxed text-gray-500 mb-3">
    {{ product.description }}
  </p>
</template>