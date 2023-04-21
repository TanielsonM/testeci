<script lang="ts" setup>
import { useLocalStorage } from "@vueuse/core";
import { storeToRefs } from "pinia";
import { v4 as uuidv4 } from "uuid";
import { useLeadsStore } from "@/store/modules/leads";
import { useCheckoutStore } from "@/store/checkout";

const leadStore = useLeadsStore();
const checkoutStore = useCheckoutStore();

onMounted(() => {
  if (process.client) {
    const setUUID = useLocalStorage("uuid", checkoutStore.uuid ?? uuidv4());

    // Set all UUID here to a clean code.
    if (!checkoutStore.uuid) {
      checkoutStore.setUUID(setUUID.value);
    }

    if (!leadStore.uuid) {
      leadStore.setUUID(setUUID.value);
    }

    const leadTimer = setInterval(() => {
      leadStore.sendLead();
    }, 1121000);
  }
});

onBeforeUnmount(() => {
  if (process.client) {
    clearInterval(leadTimer);
  }
});
</script>
<template></template>
