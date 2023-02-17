<script setup>
import { storeToRefs } from "pinia";
import { useProductStore } from "~~/stores/product";
import { useCustomCheckoutStore } from "~~/stores/customCheckout";

/* Variables */
const custom_checkout = useCustomCheckoutStore();
const productStore = useProductStore();
const { product } = storeToRefs(productStore);
</script>

<template>
  <Head>
    <Title>{{ product.name }} | Checkout</Title>
    <Meta name="description" :content="product.description" />
  </Head>
  <section class="w-full md:max-w-[780px] flex flex-col gap-10">
    <!-- Purchase card -->
    <BaseCard
      class="flex justify-end items-end p-5 md:py-[50px] md:px-[60px]"
      data-anima="bottom"
    >
      <Steps :title="$t('components.steps.personal_data')" step="01">
        <template #end-line>
          <LocaleSelect />
        </template>
      </Steps>
      <FormPersonal />
    </BaseCard>
    <!-- End purchase card -->
    <!-- Bottom thumb (custom checkout) -->
    <img
      v-if="custom_checkout.bottomThumb"
      :src="custom_checkout.bottomThumb"
      alt="Thumb inferior"
      class="w-full object-contain"
    />
    <!-- End bottom thumb (custom checkout) -->
    <FooterSafe />
  </section>
  <!-- Product Card -->
  <section class="w-full md:max-w-[380px] flex flex-col gap-10">
    <ProductCard :product="product" data-anima="bottom" />
    <!-- Side Thumb -->
    <img
      v-if="custom_checkout.sideThumb"
      :src="custom_checkout.sideThumb"
      alt="Thumb lateral"
      class="w-full hidden md:block"
    />
    <!-- End side Thumb -->
  </section>
</template>