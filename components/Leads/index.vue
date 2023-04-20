<script lang="ts" setup>
import { storeToRefs } from "pinia";
import { v4 as uuidv4 } from "uuid";
import { useLeadsStore } from "@/store/modules/leads";

const leadStore = useLeadsStore();
const sendLead = leadStore.sendLead();
</script>

<template>
  {{ leadStore.uuid }}
</template>
