<script lang="ts" setup>
import { useLocalStorage } from "@vueuse/core";
import { v4 as uuidv4 } from "uuid";
import { useLeadsStore } from "@/store/modules/leads";
import { useCheckoutStore } from "@/store/checkout";
import { useProductStore } from "@/store/product";

const leadStore = useLeadsStore();
const checkoutStore = useCheckoutStore();
const productStore = useProductStore();

const { product_id } = storeToRefs(productStore);

onMounted(() => {
  if (process.client) {
    const setUUID = useLocalStorage(product_id.value + "_uuid", uuidv4());

    // Set all UUID here to a clean code.
    checkoutStore.setUUID(setUUID.value);
    leadStore.setUUID(setUUID.value);
  }
});
</script>
<template></template>
