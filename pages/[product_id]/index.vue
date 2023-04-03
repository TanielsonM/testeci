<script setup>
import { storeToRefs } from "pinia";
import { useProductStore } from "~~/store/product";
import { useCheckoutStore } from "~~/store/checkout";
import { useAddressStore } from "@/store/forms/address";
import { useCustomCheckoutStore } from "~~/store/customCheckout";

/* Variables */
const { t } = useI18n();
const custom_checkout = useCustomCheckoutStore();
const productStore = useProductStore();
const checkout = useCheckoutStore();
const address = useAddressStore();
const { product } = storeToRefs(productStore);
const { sameAddress } = storeToRefs(address);
const { method, allowed_methods } = storeToRefs(checkout);

const tabs = computed(() => {
  return allowed_methods.value.map((item) => {
    switch (item) {
      case "CREDIT_CARD":
        return {
          value: [item, "TWO_CREDIT_CARD"],
          label: t("checkout.pagamento.metodos.cartao_credito"),
          icon: "bi:credit-card-fill",
        };
      case "BOLETO":
        return {
          value: item,
          label: "Boleto",
          icon: "fa-solid:file-invoice-dollar",
        };
      case "PAYPAL":
        return {
          value: item,
          label: "Paypal",
          icon: "mdi:paypal",
        };
      case "SAFETYPAY-CASH":
        return {
          value: item,
          label: "SAFETYPAY-CASH",
          icon: "bi:credit-card-fill",
        };
      case "EFT":
        return {
          value: item,
          label: "EFT",
          icon: "bi:credit-card-fill",
        };
      case "BANKTRANSFER":
        return {
          value: item,
          label: "BANKTRANSFER",
          icon: "bi:credit-card-fill",
        };
      case "DEBITCARD":
        return {
          value: item,
          label: t("checkout.pagamento.metodos.cartao_debito"),
          icon: "bi:credit-card-fill",
        };
      case "EFECTY":
        return {
          value: item,
          label: "EFECTY",
          icon: "bi:credit-card-fill",
        };
      case "MULTICAJA":
        return {
          value: item,
          label: "MULTICAJA",
          icon: "bi:credit-card-fill",
        };
      case "SENCILLITO":
        return {
          value: item,
          label: "SENCILLITO",
          icon: "bi:credit-card-fill",
        };
      case "SERVIPAG":
        return {
          value: item,
          label: "SERVIPAG",
          icon: "bi:credit-card-fill",
        };
      case "PAGOSNET":
        return {
          value: item,
          label: "PAGOSNET",
          icon: "bi:credit-card-fill",
        };
      case "RAPIPAGO":
        return {
          value: item,
          label: "RAPIPAGO",
          icon: "bi:credit-card-fill",
        };
      case "PAGOFACIL":
        return {
          value: item,
          label: "PAGOFACIL",
          icon: "bi:credit-card-fill",
        };
      case "WEBPAY":
        return {
          value: item,
          label: "WEBPAY",
          icon: "bi:credit-card-fill",
        };
      case "OXXO":
        return {
          value: item,
          label: "OXXO",
          icon: "bi:credit-card-fill",
        };
      case "SPEI":
        return {
          value: item,
          label: "SPEI",
          icon: "bi:credit-card-fill",
        };
      case "PIX":
        return {
          value: item,
          label: "Pix",
          icon: "material-symbols:qr-code",
        };
    }
  });
});
</script>

<template>
  <Head>
    <Title>{{ product.name }} | Checkout</Title>
    <Meta name="description" :content="product.description" />
  </Head>
  <section class="flex w-full flex-col gap-10 lg:max-w-[780px]">
    <!-- Purchase card -->
    <BaseCard class="w-full p-5 md:py-[50px] md:px-[60px]" data-anima="bottom">
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
      <!-- Purchase Form -->
      <Steps
        :title="$t('checkout.pagamento.title')"
        :step="checkout.showAddressStep() ? '03' : '02'"
      >
        <template #content>
          <section class="flex w-full flex-col gap-8">
            <BaseTabs v-model="method" :tabs="tabs" />
            <FormPurchase />
          </section>
        </template>
      </Steps>
      <!-- Bumps -->
      <template v-if="checkout.getBumpList.length">
        <p class="text-txt-color w-full">
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
      <!-- Purchase button -->
      <BaseButton class="mt-10">
        <span class="text-[15px] font-semibold">
          {{
            custom_checkout.purchase_text || $t("checkout.footer.btn_compra")
          }}
        </span>
      </BaseButton>
      <span class="flex items-center gap-3">
        <Icon name="fa6-solid:lock" class="text-main-color" />
        <p class="text-txt-color text-[13px] font-normal">
          {{ $t("checkout.footer.info_seguranca") }}
        </p>
      </span>
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
