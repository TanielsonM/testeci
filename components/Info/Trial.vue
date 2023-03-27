<script lang="ts" setup>
import { storeToRefs } from "pinia";
import { useProductStore } from "~~/store/product";

const { t } = useI18n();
const store = useProductStore();
const { hasTrial, productType, getPeriod } = storeToRefs(store);

const period = computed(() => {
  switch (getPeriod.value) {
    case 30:
      return t("order.por_mes");

    case 90:
      return t("order.por_trimestre");

    case 180:
      return t("order.por_semestre");

    case 365:
      return t("order.por_ano");

    default:
      if (getPeriod.value > 365) {
        return `/ ${Math.floor(getPeriod.value / 365)} ${t("order.anos")}`;
      } else {
        return `/ ${getPeriod.value} ${t("order.dias")}`;
      }
  }
});
</script>

<template>
  <BaseBadge v-if="hasTrial">
    {{ $t("order.apos_trial") }} {{ $t("order.de") }}
    {{ hasTrial }}
    {{ $t("order.dias") }}:
    {{ store.calculateAmountAfterTrial() }}
    <span v-if="productType === 'SUBSCRIPTION'">
      {{ period }}
    </span>
  </BaseBadge>
</template>