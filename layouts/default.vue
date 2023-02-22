<script setup>
import { useCustomCheckoutStore } from "~~/stores/customCheckout";
import { useProductStore } from "~~/stores/product";
const custom_checkout = useCustomCheckoutStore();
const product = useProductStore();

const route = useRoute();
if (route.params.product_id)
  await useGetProduct(route.params.product_id, route.params.hash);
</script>

<template>
  <main
    class="bg-background flex min-h-screen w-screen flex-col items-center gap-8"
    :data-theme="custom_checkout.theme"
    :data-theme_color="custom_checkout.themeColor"
  >
    <BaseHeader />
    <BaseCard
      class="mt-10 flex flex-col items-center gap-6 border-b-4 border-b-error py-10 px-20 max-w-[800px]"
      v-if="!product.isValid"
    >
      <Icon name="mdi:close-circle" size="120" class="text-error" />
      <h1 class="text-2xl">{{ $t('general.error_message') }}</h1>
    </BaseCard>
    <section
      v-else
      class="flex w-screen flex-col-reverse items-center justify-center gap-5 px-5 pb-10 md:flex-row md:items-start md:gap-16"
    >
      <slot />
    </section>
    <BaseFooter v-if="product.isValid" />
    <ButtonWhatsapp v-if="product.isValid" />
  </main>
</template>
