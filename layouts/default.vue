<script setup>
import { useCustomCheckoutStore } from '~~/stores/customCheckout';
const custom_checkout = useCustomCheckoutStore()

const route = useRoute();
if (route.params.product_id) await useGetProduct(route.params.product_id)
</script>

<template>
  <main
    class="w-screen min-h-screen flex flex-col items-center justify-between gap-8 bg-background"
    :data-theme="custom_checkout.theme"
    :data-theme_color="custom_checkout.themeColor"
  >
    <BaseHeader />
    <section
      class="
        w-screen
        flex flex-col-reverse
        items-center
        justify-center
        md:flex-row md:items-start
        gap-5
        md:gap-16
        px-5
        pb-10
      "
    >
      <slot />
    </section>
    <BaseFooter />
    <ButtonWhatsapp />
  </main>
</template>