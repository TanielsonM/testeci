<script setup>
// Logos
import Greenn from "@/assets/logos/logo.png";
import Heaven from "@/assets/heaven/logo.svg";
// Stores
import { useCustomCheckoutStore } from "~~/store/customCheckout";
import { useProductStore } from "~~/store/product";
import { useCheckoutStore } from "~~/store/checkout";
// Variables
const custom_checkout = useCustomCheckoutStore();
const product = useProductStore();
const checkout = useCheckoutStore();
const logo = computed(() => checkout.isHeaven ? Heaven : Greenn);
</script>

<template>
  <main
    v-if="checkout.isLoading"
    class="bg-background flex h-screen w-screen flex-col items-center justify-center gap-8"
  >
    <img
      :src="logo"
      alt="logo do greenn"
      width="250"
      class="animate-bounce"
    />
  </main>
  <main
    v-else
    class="bg-background flex min-h-screen w-screen flex-col items-center gap-8 px-5"
    :data-theme="custom_checkout.theme"
    :data-theme_color="custom_checkout.themeColor()"
  >
    <BaseHeader />
    <BaseCard
      class="border-b-error mt-10 flex max-w-[800px] flex-col items-center gap-6 border border-gray-200 border-b-4 py-10 px-5 md:px-20"
      v-if="!product.isValid()"
    >
      <Icon name="mdi:close-circle" size="120" class="text-error" />
      <h1 class="text-2xl text-center">{{ $t("general.error_message") }}</h1>
    </BaseCard>
    <section
      v-else
      class="flex w-screen flex-col-reverse items-center justify-center gap-5 px-5 pb-10 md:flex-row md:items-start md:gap-16"
    >
      <slot />
    </section>
    <BaseFooter v-if="product.isValid()" />
    <ButtonWhatsapp v-if="product.isValid()" />
  </main>
</template>
