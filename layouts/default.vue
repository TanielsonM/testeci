<script setup>
// Stores
import { useCustomCheckoutStore } from "~~/store/customCheckout";
import { useProductStore } from "~~/store/product";
import { useCheckoutStore } from "~~/store/checkout";
// Variables
const custom_checkout = useCustomCheckoutStore();
const product = useProductStore();
const checkout = useCheckoutStore();
const logo = computed(() => (checkout.isHeaven ? "Heaven" : "Greenn"));
const greennWrapper = ref(null)

onMounted(() => {
  custom_checkout.greennWrapper = greennWrapper;
});
</script>

<template>
  <main
    v-if="checkout.isLoading"
    class="flex h-screen w-screen flex-col items-center justify-center gap-8 bg-background"
  >
    <img
      v-if="logo === 'Heaven'"
      src="@/assets/heaven/logo.svg"
      alt="logo do greenn"
      width="250"
      class="animate-bounce"
    />
    <img
      v-if="logo === 'Greenn'"
      src="@/assets/logos/logo.png"
      alt="logo do greenn"
      width="250"
      class="animate-bounce"
    />
  </main>
  <main
    v-else
    ref="greennWrapper" 
    class="flex min-h-screen w-full flex-col items-center gap-10 bg-background"
    :data-theme="product.isValid() ? custom_checkout.theme : 'light'"
    :data-theme_color="
      product.isValid() ? custom_checkout.themeColor : '#00E4A0'
    "
  >
    <BaseHeader />
    <section class="flex w-full max-w-[1240px] justify-center">
      <BaseCard
        class="mt-10 flex max-w-[800px] flex-col items-center gap-6 border border-b-4 border-gray-200 border-b-error px-5 py-10 md:px-20"
        v-if="!product.isValid()"
      >
        <Icon name="mdi:close-circle" size="120" class="text-error" />
        <h1 class="text-center text-2xl">{{ $t("general.error_message") }}</h1>
      </BaseCard>
      <section
        v-else
        class="flex flex-col-reverse gap-10 overflow-x-hidden px-3 md:items-start md:overflow-x-auto lg:flex-row"
      >
        <slot />
      </section>
    </section>
    <BaseFooter v-if="product.isValid()" />
    <ButtonWhatsapp v-if="product.isValid()" />
  </main>
</template>
