<script lang="ts" setup>
import { storeToRefs } from "pinia";
import { v4 as uuidv4 } from "uuid";
import { useLeadsStore } from "@/store/modules/leads";

const leadStore = useLeadsStore();

async function updateLeadStates() {
  await useApi()
    .update(`/calculate/`)
    .then((res) => {
      console.log("finished request");
    })
    .finally(() => {
      console.log("lead updated");
    });
}
</script>

<template>
  {{ leadStore.uuid }}
</template>
