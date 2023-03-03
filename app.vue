<script lang="ts" setup>
import { useCheckoutStore } from "~~/store/checkout";
const checkout = useCheckoutStore();
if (process.client) {
  checkout.setProjectDomain(window.location.href);
}

</script>

<template>
  <div>
    <NuxtLayout>
      <NuxtPage />
    </NuxtLayout>
  </div>
</template>
