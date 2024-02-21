<script setup>
import { useProductStore } from "~~/store/product";
const { product } = useProductStore();
</script>

<template>
  <h5 class="text-[24px] font-[700] text-input-color">{{ product.name }}</h5>
</template>