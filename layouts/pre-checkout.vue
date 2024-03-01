<script setup>
// Traduction
import { useI18n } from "vue-i18n";
const { t: $t } = useI18n();
// Stores
import { useCustomCheckoutStore } from "~~/store/customCheckout";
import { useProductStore } from "~~/store/product";
import { useCheckoutStore } from "~~/store/checkout";
// Variables
const custom_checkout = useCustomCheckoutStore();
const productStore = useProductStore();
// const { product } = useProductStore();
const checkout = useCheckoutStore();
const logo = computed(() => (checkout.isHeaven ? "Heaven" : "Greenn"));

const computedProduct = computed(() => {
  const { product } = useProductStore();
  return {
    ...product,
  };
});

watch(computedProduct, (value) => {
  if (value) {
    if (!value.start_date || !value.location) {
      checkout.setError($t("pre_checkout.location_config"));
    }
  }
});
</script>

<template>
  <main v-if="checkout.isLoading" class="flex h-screen w-screen flex-col items-center justify-center gap-8">
    <img v-if="logo === 'Heaven'" src="@/assets/heaven/logo.svg" alt="logo do greenn" width="250" class="animate-bounce" />
    <img v-if="logo === 'Greenn'" src="@/assets/logos/logo.png" alt="logo do greenn" width="250" class="animate-bounce" />
  </main>
  <main v-else class="flex min-h-screen w-full flex-col items-center gap-10" :class="{ 'bg-background': custom_checkout.theme === 'dark' }" :data-theme="productStore.isValid() ? custom_checkout.theme : 'light'" :data-theme_color="productStore.isValid()
    ? (custom_checkout.themeColor === '#00E4A0' ? 'dark-greenn' : custom_checkout.themeColor)
    : 'dark-greenn'
    ">
    <BaseHeader />
    <section class="flex w-full max-w-[1240px] justify-center">
      <BaseCard class="mt-10 flex max-w-[800px] flex-col items-center gap-6 border border-b-4 border-gray-200 border-b-error px-5 py-10 md:px-20" v-if="!productStore.isValid()">
        <Icon name="mdi:close-circle" size="120" class="text-error" />
        <h1 class="text-center text-2xl">{{ $t("general.error_message") }}</h1>
      </BaseCard>
      <section v-else class="flex flex-col gap-10 w-full overflow-x-hidden px-3 md:overflow-x-auto md:flex-row">
        <slot />
      </section>
    </section>
    <BaseFooter v-if="productStore.isValid()" :installments_fee="false" />
    <ButtonWhatsapp v-if="productStore.isValid()" />
  </main>
</template>
