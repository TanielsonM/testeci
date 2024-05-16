<script setup>
import { storeToRefs } from "pinia";
import { useCheckoutStore } from "@/store/checkout";

const { t } = useI18n();
const checkout = useCheckoutStore();
const { history_subscription } = storeToRefs(checkout);

</script>

<template>
  <ClientOnly v-if="history_subscription">
    {{ (history_subscription?.total_charges_paid + 1) + $t("order.cobranca") }}
    <template v-if="history_subscription?.contract_charges">
      {{ ' ' + $t("order.de") + ' ' + history_subscription?.contract_charges }}
    </template>
  </ClientOnly>
</template>
