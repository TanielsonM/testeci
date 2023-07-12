<script setup>
import moment from "moment";
import { useProductStore } from "~~/store/product";

const { product } = useProductStore();
</script>

<template>
  <ul class="mb-6 text-txt-color">
    <li class="flex items-center mb-2">
      <div class="min-w-[15px] h-[15px] bg-main-color mr-3"></div>
      <span>Data do evento: {{ moment(product.event_date).format('DD/MM/YYYY') }}</span>
    </li>
    <li class="flex items-center mb-2">
      <div class="min-w-[15px] h-[15px] bg-main-color mr-3"></div>
      <span>Início: 23:00 (horário de Brasília)</span>
    </li>
    <li class="flex items-center mb-2">
      <div class="min-w-[15px] h-[15px] bg-main-color mr-3"></div>
      <span>Local: Rua Riachuelo, 97 - Centro - Rio de Janeiro/RJ</span>
    </li>
  </ul>
</template>