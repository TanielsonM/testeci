<script setup>
import moment from "@/plugins/moment";
import { useProductStore } from "~~/store/product";

const { product } = useProductStore();
const startDateMonth = product.start_date ? (moment(product.start_date).format('MMM')).toUpperCase() : '---';
const startDateDay = product.start_date ? moment(product.start_date).format('DD') : 'X';
</script>

<template>
  <div class="w-[85px] h-[94px] border border-[#E5E5E5] rounded-lg">
    <div class="w-full h-[31px] bg-main-color rounded-t-lg text-center">
      <span class="text-[14px] font-[600] text-white">{{ startDateMonth }}</span>
    </div>
    <div class="w-full h-[63px] flex justify-center items-center">
      <span class="text-[32px] font-[700] text-input-color">{{ startDateDay }}</span>
    </div>
  </div>
</template>