<script lang="ts" setup>
import { useLeadsStore } from "@/store/modules/leads";

const leadStore = useLeadsStore();
const { uuid } = storeToRefs(leadStore);

let leadTimer: NodeJS.Timer | undefined = undefined;

function unsetTimer(timer: NodeJS.Timer | undefined) {
  clearInterval(timer);
}

watch(uuid, () => {
  leadStore.syncPayment();
  leadStore.syncLead();

  if (process.client) {
    leadTimer = setInterval(() => {
      leadStore.updateLead();
    }, 60000);
  }
});

onBeforeUnmount(() => {
  unsetTimer(leadTimer);
});
</script>
<template></template>
