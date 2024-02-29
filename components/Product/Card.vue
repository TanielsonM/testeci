<script setup>
import { storeToRefs } from "pinia";
import { useProductStore } from "~~/store/product";
import { useCustomCheckoutStore } from "~~/store/customCheckout";
import { useCheckoutStore } from "~~/store/checkout";
import { formatMoney } from "~/utils/money";
import { useInstallmentsStore } from "~~/store/modules/installments";
const productStore = useProductStore();
const custom_checkout = useCustomCheckoutStore();
const checkout = useCheckoutStore();
const installmentsStore = useInstallmentsStore();
const { t } = useI18n();
/* State */
const opened = ref(false);
const { product, is_gift, gift_message } = storeToRefs(productStore);
const { method, installments, hasFees } = storeToRefs(checkout);
const { trial_position } = storeToRefs(custom_checkout);
const { getInstallments } = storeToRefs(installmentsStore);

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

const exceptionSellerId = computed(() => {
  if(useRuntimeConfig().public.CUSTOM_CHARGES_EXCEPTION) {
    const ids = JSON.parse(useRuntimeConfig().public.CUSTOM_CHARGES_EXCEPTION)
    return ids.some(x => parseInt(x) === parseInt(product.value.seller.id))
  }
  return false
})

</script>

<template>
  <BaseCard class="w-full bg-checkout">
    <header
      class="flex h-[50px] w-full items-center gap-1 rounded-t-lg bg-main-color px-5"
    >
      <Icon name="mdi:shield-half-full" class="h-4 w-4 text-white" />
      <p class="text-sm font-semibold text-white">
        {{ $t("components.product_card.title_header") }}
      </p>
    </header>
    <section class="flex w-full items-center px-5">
      <!-- Product Image -->
      <aside
        class="mr-[30px] flex max-h-[120px] min-h-[120px] max-w-[90px] items-center overflow-hidden rounded bg-stone-100 md:mr-[15px] md:max-w-[100px] xl:max-w-[120px]"
        v-if="product.images.length"
      >
        <nuxt-img
          :src="product.images[0].path"
          preload
          alt="Imagem do produto"
          width="auto"
          height="auto"
          rel="preload"
          format="webp"
          class="h-full w-full object-contain"
        />
      </aside>
      <span
        v-else
        class="h-[120px] w-[120px] rounded bg-gray-200 shadow"
      ></span>
      <!--  -->
      <!-- Product Infos -->
      <section class="flex flex-col gap-1 text-txt-color">
        <small class="text-blue-500" v-if="productStore.isSubscription">{{
          $t("components.product_card.is_subscription")
        }}</small>
        <h1 class="mb-[5px] text-[18px] font-[700] text-input-color">
          {{ product.name }}
        </h1>
        <p
          class="text-lg font-semibold leading-4 text-txt-color"
          :class="{ underline: productStore.hasTrial }"
          v-if="productStore.hasTrial"
        >
          {{ trialMessage }}
        </p>
        <ProductTotalAmount v-else />
        <section
          class="custom_charges"
          v-if="!!productStore.hasCustomCharges.length && !exceptionSellerId"
        >
          <section class="charges" :opened="opened">
            <p
              v-for="charge in productStore.hasCustomCharges.filter(
                (item) => item.amount > 0
              )"
              :key="charge.id"
              class="flex w-full items-center justify-between"
            >
              <span>
                {{ charge.sequence }}ª
                {{ $t("checkout.different_amount_text.charge") }}
              </span>
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
        productStore.canBeGifted &&
        product?.method !== 'FREE'
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
    <InfoTrial class="mx-5" v-if="trial_position === 'top'" />
    <!-- Purchase Details -->
    <PurchaseDetails />
    <!-- More product infos -->
    <section class="flex flex-col gap-3 px-5 pb-5">
      <!-- Warranty -->
      <p
        class="flex items-center gap-1 md:flex-col md:items-start"
        v-if="custom_checkout.showWarranty"
      >
        <span class="infos-title"
          >{{ $t("components.product_card.warranty")
          }}<span class="md:hidden">:</span></span
        >
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
        <span class="infos-title"
          >{{ $t("components.product_card.author")
          }}<span class="md:hidden">:</span></span
        >
        <span class="infos-content">
          {{
            product.seller.company
              ? product.seller.company.fantasy_name ||
                product.seller.company.name
              : product.seller.name
          }}
        </span>
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
        <span class="infos-title"
          >{{ $t("general.mail") }}<span class="md:hidden">:</span></span
        >
        <span class="infos-content">{{ product.seller.company.email }}</span>
      </p>
      <!-- Cellphone -->
      <p
        class="mb-5 flex items-center gap-2 md:flex-col md:items-start"
        v-if="
          product.seller &&
          product.seller.company &&
          product.seller.company.support_telephone
        "
      >
        <span class="infos-title"
          >{{ $t("general.telephone") }}<span class="md:hidden">:</span></span
        >
        <a
          class="text-xs text-blue-400"
          :href="`tel:${product.seller.company.support_telephone}`"
        >
          {{ product.seller.company.support_telephone }}
        </a>
      </p>
      <!-- Coupon -->
      <ProductCoupon v-if="productStore.allowedCoupon" />
      <ProductCashback />
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
