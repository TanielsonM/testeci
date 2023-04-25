<script lang="ts" setup>
import { useLocalStorage } from "@vueuse/core";
import { storeToRefs } from "pinia";
import { v4 as uuidv4 } from "uuid";
import { useLeadsStore } from "@/store/modules/leads";
import { useCheckoutStore } from "@/store/checkout";

const leadStore = useLeadsStore();
const checkoutStore = useCheckoutStore();

onMounted(() => {
  if (leadStore.uuid) {
    console.log("test" + leadStore.uuid);
    leadStore.syncLead();

    const leadTimer = setInterval(() => {
      leadStore.updateLead();
    }, 1000 * 240);
  }
});

onBeforeUnmount(() => {
  clearInterval(leadTimer);
});
</script>
<template></template>
