<script setup>
import moment from "moment";
import { useProductStore } from "~~/store/product";

const { product } = useProductStore();
</script>

<template>
  <ul class="mb-6 text-txt-color">
    <li class="flex items-center mb-5">
      <img class="mr-3" width="18" src="@/assets/icons/calendar.svg" alt="calendar">
      <span>Data do evento: {{ moment(product?.event_date).format('DD/MM/YYYY') }}</span>
    </li>
    <li class="flex items-center mb-5">
      <img class="mr-3" width="18" src="@/assets/icons/clock.svg" alt="clock">
      <span>Início: {{ moment(product?.event_date).format('HH:mm') }} (horário de Brasília)</span>
    </li>
    <li class="flex items-center mb-5">
      <img class="mr-3" width="18" src="@/assets/icons/location.svg" alt="location">
      <span>
        Local:
            {{ product?.address?.street }},
            {{ product?.address?.number }}
          - {{ product?.address?.neighborhood }}
          - {{ product?.address?.city }}
      </span>
    </li>
  </ul>
</template>