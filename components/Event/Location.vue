<script setup>
import { useProductStore } from "~~/store/product";
const { product } = useProductStore();
</script>

<template>
  <div class="mb-3">
    <p class="text-[16px] font-[700] text-main-color mb-3">Local do evento</p>
    <p class="text-[16px] font-[500] leading-relaxed text-input-color">
      {{ product?.location }}
    </p>
    <p class="text-[16px] font-[400] leading-relaxed text-input-color mb-3">
      {{ product?.address?.street }},
            {{ product?.address?.number }}
          - {{ product?.address?.neighborhood }}
          - {{ product?.address?.city }}
    </p>
  </div>
</template>