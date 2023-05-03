<script lang="ts" setup>
import { storeToRefs } from "pinia";
import { useLeadsStore } from "@/store/modules/leads";
import { useCheckoutStore } from "@/store/checkout";
import { useProductStore } from "@/store/product";

const leadStore = useLeadsStore();
const checkoutStore = useCheckoutStore();
const productStore = useProductStore();

const { uuid, payment } = storeToRefs(leadStore);

// remove before finish it, just to debug
const debug = false;

onMounted(() => {
  watch(uuid, () => {
    const syncPayment = leadStore.syncPayment();
    const syncLead = leadStore.syncLead();

    const leadTimer = setInterval(() => {
      leadStore.updateLead();
    }, 60000);
  });
});

onBeforeUnmount(() => {
  clearInterval(leadTimer);
});
</script>
<template>
<div v-if="debug">
  lead uuid: {{ leadStore.uuid }}<br />
  checkout uuid: {{ checkoutStore.uuid }}<br />
  product id: {{ productStore.product_id }}<br />
  seller id: {{ productStore.seller_id }}<br />
  </div>
</template>
