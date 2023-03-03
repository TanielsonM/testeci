<script lang="ts" setup>
// Stores
import { useCheckoutStore } from "~~/store/checkout";
// Variables
const checkout = useCheckoutStore();
if (process.client) {
  await checkout.setProjectDomain(window.location.href);
}
checkout.init();
</script>

<template>
  <div>
    <NuxtLayout>
      <NuxtPage />
    </NuxtLayout>
  </div>
</template>
