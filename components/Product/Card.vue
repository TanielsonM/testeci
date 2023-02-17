<script setup>
import { storeToRefs } from 'pinia';
import { useProductStore } from '~~/stores/product';
import { useCustomCheckoutStore } from '~~/stores/customCheckout';

const productStore = useProductStore();
const custom_checkout = useCustomCheckoutStore();
const { product, amount } = storeToRefs(productStore)
const amountText = computed(() => {
  const method = "BOLETO";
  switch(method) {
    case "CREDIT_CARD": return `12x de R$ ${amount.value}`
    default: return `R$ ${amount.value}`;
  }
});
</script>

<template>
  <BaseCard class="w-full bg-checkout">
    <header
      class="
        bg-main-color
        h-[50px]
        w-full
        rounded-t-lg
        flex
        items-center
        gap-1
        px-5
      "
    >
      <Icon name="mdi:shield-half-full" class="text-white w-4 h-4" />
      <p class="text-white font-semibold text-sm">
        {{ $t("components.product_card.title_header") }}
      </p>
    </header>
    <section class="flex gap-4 w-full items-start px-5">
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
        class="object-contain rounded w-full h-full max-w-[120px] max-h-[120px]"
      />
      <span
        v-else
        class="w-[120px] h-[120px] rounded shadow bg-gray-200"
      ></span>
      <!--  -->
      <!-- Product Infos -->
      <section class="flex flex-col gap-1 text-txt-color">
        <h1 class="text-lg font-bold">{{ product.name }}</h1>
        <p class="text-lg text-txt-color font-semibold">{{ amountText }}</p>
      </section>
      <!--  -->
    </section>
    <!-- More product infos -->
    <section class="flex flex-col gap-3 px-5 pb-5">
      <!-- Warranty -->
      <p class="flex items-center md:items-start md:flex-col gap-1" v-if="custom_checkout.showWarranty">
        <span class="infos-title">{{ $t("components.product_card.warranty") }}</span>
        <span class="infos-content">{{ product.warranty }} {{ $t('components.product_card.warranty_days') }}</span>
      </p>
      <!-- Author -->
      <p class="flex items-center md:items-start md:flex-col gap-1" v-if="product.seller">
        <span class="infos-title">{{ $t("components.product_card.author") }}</span>
        <span class="infos-content">{{ product.seller.name }}</span>
      </p>
      <!-- Email -->
      <p
        class="flex items-center md:items-start md:flex-col gap-1"
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
        class="flex items-center md:items-start md:flex-col gap-2"
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