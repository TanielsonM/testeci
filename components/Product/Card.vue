<script setup>
import { storeToRefs } from "pinia";
import { useProductStore } from "~~/stores/product";
import { useCustomCheckoutStore } from "~~/stores/customCheckout";

const productStore = useProductStore();
const custom_checkout = useCustomCheckoutStore();
/* State */
const { product, amount, method } = storeToRefs(productStore);
const amountText = computed(() => {
  switch (method.value) {
    case "CREDIT_CARD":
      return `12x de R$ ${amount.value}`;
    default:
      return `R$ ${amount.value}`;
  }
});
</script>

<template>
  <BaseCard class="bg-checkout w-full">
    <header
      class="bg-main-color flex h-[50px] w-full items-center gap-1 rounded-t-lg px-5"
    >
      <Icon name="mdi:shield-half-full" class="h-4 w-4 text-white" />
      <p class="text-sm font-semibold text-white">
        {{ $t("components.product_card.title_header") }}
      </p>
    </header>
    <section class="flex w-full items-start gap-4 px-5">
      <!-- Product Image -->
      <nuxt-img
        v-if="product.images.length"
        :src="product.images[0].path"
        preload
        loading="lazy"
        alt="Imagem do produto"
        width="auto"
        height="auto"
        rel="preload"
        format="webp"
        class="h-full max-h-[120px] w-full max-w-[120px] rounded object-contain"
      />
      <span
        v-else
        class="h-[120px] w-[120px] rounded bg-gray-200 shadow"
      ></span>
      <!--  -->
      <!-- Product Infos -->
      <section class="text-txt-color flex flex-col gap-1">
        <small class="text-blue-500" v-if="productStore.isSubscription">{{
          $t("components.product_card.is_subscription")
        }}</small>
        <h1 class="text-lg font-bold">{{ product.name }}</h1>
        <p class="text-txt-color text-lg font-semibold">{{ amountText }}</p>
      </section>
      <!--  -->
    </section>
    <!-- Purchase Details -->
    <PurchaseDetails />
    <!-- More product infos -->
    <section class="flex flex-col gap-3 px-5 pb-5">
      <!-- Warranty -->
      <p
        class="flex items-center gap-1 md:flex-col md:items-start"
        v-if="custom_checkout.showWarranty"
      >
        <span class="infos-title">{{
          $t("components.product_card.warranty")
        }}</span>
        <span class="infos-content"
          >{{ product.warranty }}
          {{ $t("components.product_card.warranty_days") }}</span
        >
      </p>
      <!-- Author -->
      <p
        class="flex items-center gap-1 md:flex-col md:items-start"
        v-if="product.seller"
      >
        <span class="infos-title">{{
          $t("components.product_card.author")
        }}</span>
        <span class="infos-content">{{ product.seller.name }}</span>
      </p>
      <!-- Email -->
      <p
        class="flex items-center gap-1 md:flex-col md:items-start"
        v-if="
          product.seller &&
          product.seller.company &&
          product.seller.company.email
        "
      >
        <span class="infos-title">{{ $t("general.mail") }}</span>
        <span class="infos-content">{{ product.seller.company.email }}</span>
      </p>
      <!-- Cellphone -->
      <p
        class="flex items-center gap-2 md:flex-col md:items-start"
        v-if="
          product.seller &&
          product.seller.company &&
          product.seller.company.support_telephone
        "
      >
        <span class="infos-title">{{ $t("general.telephone") }}</span>
        <a
          class="text-xs text-blue-400"
          :href="`tel:${product.seller.company.support_telephone}`"
        >
          {{ product.seller.company.support_telephone }}
        </a>
      </p>
    </section>
  </BaseCard>
</template>

<style lang="scss" scoped>
.infos {
  &-title {
    @apply text-txt-color;
    font-weight: 600;
    font-size: 13px;
  }

  &-content {
    @apply text-txt-color;
    font-size: 12px;
    font-weight: 400;
  }
}
</style>
