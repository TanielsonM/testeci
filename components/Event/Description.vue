<script setup>
import { useProductStore } from "~~/store/product";
const { product } = useProductStore();
</script>

<template>
  <div class="mb-3">
    <p class="text-[16px] font-[700] text-main-color"> Detalhes do evento </p>
    <textarea class="block w-full text-[15px] font-[400] leading-relaxed text-input-color mb-3">
      {{ product.description }}
    </textarea>
  </div>
</template>