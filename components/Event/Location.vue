<script setup>
import { useProductStore } from "~~/store/product";
const { product } = useProductStore();
</script>

<template>
  <div class="mb-3">
    <p class="text-[16px] font-[700] text-main-color mb-3">Local do evento</p>
    <p class="text-[16px] font-[500] leading-relaxed text-input-color">
      Allianz Parque | São Paulo
    </p>
    <p class="text-[16px] font-[400] leading-relaxed text-input-color mb-3">
      Av. Francisco Matarazzo, 1705 - Água Branca, São Paulo - SP, 05001-200, Brazil
    </p>
  </div>
</template>