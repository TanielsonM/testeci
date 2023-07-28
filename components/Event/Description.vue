<script setup>
import { useProductStore } from "~~/store/product";
const { product } = useProductStore();
</script>

<template>
  <div class="mb-3">
    <p class="text-[16px] font-[700] text-main-color mb-3">Detalhes do evento</p>
    <p class="text-[15px] font-[400] leading-relaxed text-input-color mb-3">
      {{ product.description }}
    </p>
  </div>
</template>