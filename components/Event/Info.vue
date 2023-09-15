<script setup>
import moment from "@/plugins/moment";
import { useProductStore } from "~~/store/product";

const { product } = useProductStore();
</script>

<template>
  <ul class="mb-6 text-txt-color">
    <li class="flex items-center mb-5">
      <img class="mr-3" width="18" src="@/assets/icons/calendar.svg" alt="calendar">
      <span>
        {{ moment(product?.event_date).format('ddd') }},
        {{ moment(product?.event_date).format('LL') }}
      </span>
    </li>
    <li class="flex items-center mb-5">
      <img class="mr-3" width="18" src="@/assets/icons/clock.svg" alt="clock">
      <span>{{ moment(product?.event_date).format('HH:mm') }} (horário de Brasília)</span>
    </li>
    <li class="flex items-center mb-5">
      <img class="mr-3" width="18" src="@/assets/icons/location.svg" alt="location">
      <span>
        {{ product?.location }}
      </span>
    </li>
  </ul>
</template>