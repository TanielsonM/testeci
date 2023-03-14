<script setup>
import { storeToRefs } from "pinia";
import { useProductStore } from "~~/store/product";
import { useCheckoutStore } from "~~/store/checkout";
import { useAddressStore } from "@/store/forms/address";
import { useCustomCheckoutStore } from "~~/store/customCheckout";

/* Variables */
const custom_checkout = useCustomCheckoutStore();
const productStore = useProductStore();
const checkout = useCheckoutStore();
const address = useAddressStore();
const { product } = storeToRefs(productStore);
const { sameAddress } = storeToRefs(address);
</script>

<template>
  <Head>
    <Title>{{ product.name }} | Checkout</Title>
    <Meta name="description" :content="product.description" />
  </Head>
  <section class="flex w-full flex-col gap-10 lg:max-w-[780px]">
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
      <Steps
        :title="$t('components.steps.address')"
        step="02"
        v-if="checkout.showAddressStep()"
      >
        <template #content>
          <FormAddress />
          <BaseToogle
            v-if="checkout.hasPhysicalProduct()"
            class="my-5"
            v-model:checked="sameAddress"
            id="address-form"
            :label="$t('general.address_toogle_label')"
          />
          <Steps
            :title="$t('general.delivery_address')"
            icon="📦"
            v-if="!sameAddress"
          >
            <template #content>
              <br />
              <FormAddress type="shipping" />
            </template>
          </Steps>
        </template>
      </Steps>
      <!-- Bumps -->
      <template v-if="checkout.getBumpList.length">
        <p class="w-full text-txt-color">
          {{
            custom_checkout.hasCustomBump
              ? custom_checkout.bump_options.title
              : `${$t("checkout.pagamento.bump.title")} 🔥`
          }}
        </p>
        <OrderBumps
          v-for="(bump, index) in checkout.getBumpList"
          :key="index"
          :bump="bump"
        />
      </template>
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
  <section class="flex w-full flex-col gap-10 lg:max-w-[380px]">
    <ProductCard :product="product" data-anima="bottom" />
    <!-- Side Thumb -->
    <img
      v-if="custom_checkout.sideThumb"
      :src="custom_checkout.sideThumb"
      alt="Thumb lateral"
      class="hidden w-full lg:block"
    />
    <!-- End side Thumb -->
  </section>
</template>
