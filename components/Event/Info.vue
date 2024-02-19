<script setup>
import moment from "@/plugins/moment";
import { useProductStore } from "~~/store/product";

const { product } = useProductStore();
const startDateDDD = product.start_date ? moment(product.start_date).format('ddd') : null;
const startDateLL = product.start_date ? moment(product?.start_date).format('LL') : null;
const startDateConcat = startDateDDD && startDateLL ? `${startDateDDD},${startDateLL}` : 'Configure a data e local do evento';
const startDateTime = product.start_date ? moment(product.start_date + ' ' + product.start_time).format('HH:mm') : 'Configure a data e local do evento';
const location = product.location ? product.location : 'Configure a data e local do evento';
</script>

<template>
  <ul class="mb-6 text-txt-color">
    <li class="flex items-center mb-5">
      <img class="mr-3" width="18" src="@/assets/icons/calendar.svg" alt="calendar">
      <span>
        {{ startDateConcat }}
      </span>
    </li>
    <li class="flex items-center mb-5">
      <img class="mr-3" width="18" src="@/assets/icons/clock.svg" alt="clock">
      <span>{{ startDateTime }} (horário de Brasília)</span>
    </li>
    <li class="flex items-center mb-5">
      <img class="mr-3" width="18" src="@/assets/icons/location.svg" alt="location">
      <span>
        {{ location }}
      </span>
    </li>
  </ul>
</template>