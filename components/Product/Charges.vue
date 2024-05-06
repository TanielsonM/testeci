<script setup>
import { storeToRefs } from "pinia";
import { useCheckoutStore } from "@/store/checkout";
import { ref } from 'vue';

const { t } = useI18n();
const checkout = useCheckoutStore();
const { history_subscription } = storeToRefs(checkout);
const isRendered = ref(false);

onMounted(() => {
  onClientRender();
});

function onClientRender() {
  isRendered.value = true;
}

</script>

<template>
  <Loading v-if="!isRendered" :alignment="'left'"/>
  <ClientOnly v-else>
    {{ (history_subscription.total_charges_paid + 1) + $t("order.cobranca") }}
    <template v-if="history_subscription.contract_charges">
      {{ ' ' + $t("order.de") + ' ' + history_subscription.contract_charges }}
    </template>
  </ClientOnly>
</template>
