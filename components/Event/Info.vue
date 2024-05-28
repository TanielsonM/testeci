<script setup>
import { useProductStore } from "~~/store/product";
// Traduction
import { useI18n } from "vue-i18n";
const { t: $t } = useI18n();

const { $moment } = useNuxtApp();
const { product } = useProductStore();
const startDateDDD = product.start_date ? $moment(product.start_date).format('ddd') : null;
const startDateLL = product.start_date ? $moment(product?.start_date).format('LL') : null;
const startDateConcat = startDateDDD && startDateLL ? `${startDateDDD},${startDateLL}` : $t("pre_checkout.location_config");
const startDateTime = product.start_date ? $moment(product.start_date + ' ' + product.start_time).format('HH:mm') : $t("pre_checkout.location_config");
const location = product.location ? product.location : $t("pre_checkout.location_config");
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