<script setup>
import { useProductStore } from "~~/store/product";
// Traduction
import { useI18n } from "vue-i18n";
const { t: $t } = useI18n();

const { $moment } = useNuxtApp();
const { product } = useProductStore();

const dateEvent = computed(() => {
  return product.start_date && product.end_date ? 
    `${formatEventStartDate(product.start_date)} ${$t("components.event_date.until")} ${formatEventStartDate(product.end_date)}` 
    : formatEventStartDate(product.start_date);
});

const horsEvent = computed(() => {
  return product.start_time && product.end_time ? 
    `${formatEventTime(product.start_time)} - ${formatEventTime(product.end_time)}` 
    : formatEventTime(product.start_time);
});

function formatEventStartDate(Date) {
    const startDate = $moment(Date); 
    const dayOfWeek = startDate.format('ddd'); 
    const dateFormatted = startDate.format('D MMM, YYYY'); 
    const startDateConcat = `${dayOfWeek}, ${dateFormatted}`; 
    return startDateConcat;
}

function formatEventTime(hora){
  const startHora = $moment(hora, "HH:mm:ss");
  return startHora.format('HH[h]mm[m]'); 
}

const location = product.location ? product.location : $t("pre_checkout.location_config");
</script>

<template>
  <ul class="mb-6 text-txt-color">
    <li class="flex items-center mb-5">
      <img class="mr-3" width="18" src="@/assets/icons/calendar.svg" alt="calendar">
      <span>
        {{ dateEvent }}
      </span>
    </li>
    <li class="flex items-center mb-5">
      <img class="mr-3" width="18" src="@/assets/icons/clock.svg" alt="clock">
      <span>{{ horsEvent }} (horário de Brasília)</span>
    </li>
    <li class="flex items-center mb-5">
      <img class="mr-3" width="18" src="@/assets/icons/location.svg" alt="location">
      <span>
        {{ location }}
      </span>
    </li>
  </ul>
</template>