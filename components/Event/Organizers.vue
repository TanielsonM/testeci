<script setup>
import { useProductStore } from "~~/store/product";
const { product } = useProductStore();
</script>

<template>
  <div>
    <p class="text-[16px] font-[700] text-main-color mb-3">{{ $t("pre_checkout.organizers") }}</p>
    <p class="text-[16px] font-[400] leading-relaxed text-input-color mb-3">
      {{ (product?.seller?.company ? product?.seller?.company?.fantasy_name : product?.seller?.name).toUpperCase() }}
    </p>
  </div>
</template>