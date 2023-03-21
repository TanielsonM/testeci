<script setup>
import { storeToRefs } from "pinia";
import { useProductStore } from "~~/store/product";
import { useCustomCheckoutStore } from "~~/store/customCheckout";
import { useCheckoutStore } from "~~/store/checkout";
import { formatMoney } from "~/utils/money";
const productStore = useProductStore();
const custom_checkout = useCustomCheckoutStore();
const checkout = useCheckoutStore();
const { t } = useI18n();
/* State */
const opened = ref(false);
const { product, is_gift, gift_message } = storeToRefs(productStore);
const { getInstallments, method, installments, hasFees } =
  storeToRefs(checkout);

/* Trial message */
const trialMessage = computed({
  get() {
    if (product.value.trial === 1) {
      return `${t("order.gratuito_por")} ${product.value.trial} ${t(
        "checkout.pagamento.bump.day"
      )}.`;
    }
    return `${t("order.gratuito_por")} ${product.value.trial} ${t(
      "checkout.pagamento.bump.day"
    )}s.`;
  },
});
const period = computed(() => {
  switch (productStore.getPeriod) {
    case 30:
      return t("order.por_mes");

    case 90:
      return t("order.por_trimestre");

    case 180:
      return t("order.por_semestre");

    case 365:
      return t("order.por_ano");

    default:
      if (productStore.getPeriod > 365) {
        return `/ ${Math.floor(productStore.getPeriod / 365)} ${t(
          "order.anos"
        )}`;
      } else {
        return `/ ${productStore.getPeriod} ${t("order.dias")}`;
      }
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
        class="h-full max-h-[120px] w-[120px] rounded object-contain"
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
        <p
          class="text-txt-color text-lg font-semibold"
          :class="{ underline: productStore.hasTrial }"
          v-if="productStore.hasTrial"
        >
          {{ trialMessage }}
        </p>
        <ProductTotalAmount v-else />
        <section
          class="custom_charges"
          v-if="!!productStore.hasCustomCharges.length"
        >
          <section class="charges" :opened="opened">
            <p
              v-for="charge in productStore.hasCustomCharges.filter(
                (item) => item.amount > 0
              )"
              :key="charge.id"
              class="flex w-full items-center justify-between"
            >
              <span
                >{{ charge.sequence }}ª
                {{ $t("checkout.different_amount_text.charge") }}</span
              >
              <span class="flex-nowrap">{{ formatMoney(charge.amount) }}</span>
            </p>
            <p class="flex w-full items-center justify-between">
              <span class="flex-wrap">{{
                $t("checkout.different_amount_text.other_charges")
              }}</span>
              <span class="min-w-[70px] flex-nowrap text-end">{{
                formatMoney(product.amount)
              }}</span>
            </p>
          </section>
          <button class="show-more" @click="opened = !opened">
            {{
              !opened
                ? $t("checkout.different_amount_text.show_more")
                : $t("checkout.pagamento.bump.hide")
            }}
          </button>
        </section>
      </section>
      <!--  -->
    </section>
    <!-- Gift content -->
    <section
      class="flex w-full flex-col gap-5 px-5"
      v-if="
        product.type == 'TRANSACTION' &&
        product.format == 'PHYSICALPRODUCT' &&
        productStore.canBeGifted
      "
    >
      <BaseBadge>
        <BaseCheckbox
          id="gift"
          v-model:checked="is_gift"
          :label="`${$t('checkout.address.want_gift_someone')} 🎁`"
          label-custom-class="font-semibold text-xs"
        >
        </BaseCheckbox>
      </BaseBadge>
      <BaseTextarea
        v-if="is_gift"
        v-model="gift_message"
        animation="top"
        :placeholder="$t('components.product_card.gift_placeholder')"
      ></BaseTextarea>
    </section>
    <!--  -->
    <!-- Has shipping recurring -->
    <BaseBadge
      class="mx-5"
      v-if="
        product.type === 'SUBSCRIPTION' &&
        !!product.has_shipping_fee &&
        product.shipping_fee_is_recurring === 0
      "
    >
      {{ $t("checkout.recurring_shipping.isNotRecurring") }}
    </BaseBadge>
    <!-- Trial info -->
    <BaseBadge class="mx-5" v-if="productStore.hasTrial">
      {{ $t("order.apos_trial") }} {{ $t("order.de") }}
      {{ productStore.hasTrial }}
      {{ $t("order.dias") }}:
      {{ productStore.calculateAmountAfterTrial() }}
      <span v-if="product.type === 'SUBSCRIPTION'">
        {{ period }}
      </span>
    </BaseBadge>
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
      <!-- Coupon -->
      <ProductCoupon v-if="productStore.allowedCoupon()" />
    </section>
  </BaseCard>
</template>

<style lang="scss" scoped>
.custom_charges {
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  .charges {
    width: 100%;
    border: 1px #3c88fa solid;
    border-radius: 5px;

    margin: 10px 0;
    padding: 10px;

    display: flex;
    flex-direction: column;
    gap: 10px;
    height: 45px;
    overflow-y: hidden;

    &[opened="true"] {
      height: 100%;
    }
    p {
      margin: 0;
      padding: 0;
      box-sizing: border-box;

      color: #81858e;
      font: 12px 400 "Montserrat";
      line-height: 15px;
      font-size: 13px;
      font-weight: 400;
    }
  }

  .show-more {
    color: #3c88fa;
    background: transparent;
    outline: none;
    border: none;
    font-size: 12px;
    font-weight: 400;
  }
}
</style>
