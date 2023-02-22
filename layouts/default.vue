<script setup>
import { useCustomCheckoutStore } from "~~/stores/customCheckout";
const custom_checkout = useCustomCheckoutStore();

const route = useRoute();
if (route.params.product_id) await useGetProduct(route.params.product_id, route.params.hash);
</script>

<template>
  <main
    class="bg-background flex min-h-screen w-screen flex-col items-center justify-between gap-8"
    :data-theme="custom_checkout.theme"
    :data-theme_color="custom_checkout.themeColor"
  >
    <BaseHeader />
    <section
      class="flex w-screen flex-col-reverse items-center justify-center gap-5 px-5 pb-10 md:flex-row md:items-start md:gap-16"
    >
      <slot />
    </section>
    <BaseFooter />
    <ButtonWhatsapp />
  </main>
</template>
