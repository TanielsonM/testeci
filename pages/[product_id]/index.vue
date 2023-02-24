<script setup>
import { storeToRefs } from "pinia";
import { useProductStore } from "~~/store/product";
import { useCustomCheckoutStore } from "~~/store/customCheckout";

/* Variables */
const custom_checkout = useCustomCheckoutStore();
const productStore = useProductStore();
const { product } = storeToRefs(productStore);
const showDeliveryForm = ref(true);
</script>

<template>
  <Head>
    <Title>{{ product.name }} | Checkout</Title>
    <Meta name="description" :content="product.description" />
  </Head>
  <section class="flex w-full flex-col gap-10 md:max-w-[780px]">
    <!-- Purchase card -->
    <BaseCard
      class="flex items-end justify-end p-5 md:py-[50px] md:px-[60px]"
      data-anima="bottom"
    >
      <!-- Personal form -->
      <Steps :title="$t('components.steps.personal_data')" step="01">
        <template #end-line>
          <LocaleSelect />
        </template>
        <template #content>
          <FormPersonal />
        </template>
      </Steps>
      <!-- Address form -->
      <Steps :title="$t('components.steps.address')" step="02">
        <template #content>
          <FormAddress />
          <BaseToogle
            class="my-5"
            v-model="showDeliveryForm"
            id="address-form"
            label="Endereço da entrega é o mesmo da cobrança"
          />
        </template>
      </Steps>
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
  <section class="flex w-full flex-col gap-10 md:max-w-[380px]">
    <ProductCard :product="product" data-anima="bottom" />
    <!-- Side Thumb -->
    <img
      v-if="custom_checkout.sideThumb"
      :src="custom_checkout.sideThumb"
      alt="Thumb lateral"
      class="hidden w-full md:block"
    />
    <!-- End side Thumb -->
  </section>
</template>
