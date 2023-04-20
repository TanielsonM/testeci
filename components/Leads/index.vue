<script lang="ts" setup>
import { useLeadsStore } from "@/store/modules/leads";

const leadStore = useLeadsStore();
const sendLead = leadStore.sendLead();
</script>

<template>
  {{ leadStore.uuid }}
</template>
