<script setup>
import { useProductStore } from "~~/store/product";
const { product } = useProductStore();
</script>

<template>
  <h5 class="text-base font-semibold text-input-color">{{ product.name }}</h5>
</template>