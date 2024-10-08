<script setup>
import { storeToRefs } from "pinia";
import { useProductStore } from "~~/store/product";
import { useCustomCheckoutStore } from "~~/store/customCheckout";
import { usePreCheckoutStore } from "~~/store/preCheckout";
import { useCheckoutStore } from "@/store/checkout";
import { ref } from 'vue';
import { useRouter } from 'vue-router';

const productStore = useProductStore();
const custom_checkout = useCustomCheckoutStore();
const preCheckout = usePreCheckoutStore();
const checkout = useCheckoutStore();
const router = useRouter();
const { $moment } = useNuxtApp();
const { t } = useI18n();

/* State */
const opened = ref(false);
const { product, is_gift, gift_message } = storeToRefs(productStore);
const { trial_position } = storeToRefs(custom_checkout);
const { sellerHasFeatureTickets } = storeToRefs(preCheckout);
const { history_subscription } = storeToRefs(checkout);
const isRendered = ref(false);

const dateEvent = computed(() => {
  return product.value.start_date && product.value.end_date ? 
    `${formatEventStartDate(product.value.start_date)} ${t("components.event_date.until")} ${formatEventStartDate(product.value.end_date)}` 
    : formatEventStartDate(product.value.start_date);
});

const horsEvent = computed(() => {
  return product.value.start_time && product.value.end_time ? 
    `${formatEventTime(product.value.start_time)} - ${formatEventTime(product.value.end_time)}` 
    : formatEventTime(product.value.start_time);
});

const addressEvent = computed(() => {
    return `${product.value?.address?.street} | ${product.value?.address?.city}`;
});

/* Props */
const props = defineProps({
  urlSubscription:{
    type: Boolean,
    default: false
  },
});

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
    return ids.some(x => parseInt(x) == parseInt(product.value.seller.id))
  }
  return false
})

onMounted(() => {
  onClientRender();
});

function onClientRender() {
  isRendered.value = true;
}

function formatEventStartDate(Date) {
    const startDate = $moment(Date); 
    const dayOfWeek = startDate.format('ddd'); 
    const dateFormatted = startDate.format('D MMM, YYYY'); 
    const startDateConcat = `${dayOfWeek}, ${dateFormatted}`; 
    return startDateConcat;
}

function formatEventTime(hora){
  const startHora = $moment(hora, "HH:mm:ss");
  return startHora.format('HH[h]mm[m]'); 
}

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
        class="mr-[30px] flex max-h-[120px] min-h-[120px] max-w-[90px] items-center overflow-hidden rounded md:mr-[15px] md:max-w-[100px] xl:max-w-[120px] flex-shrink-0"
        v-if="product.images.length"
      >
        <img :src="product.images[0].path"
          preload
          alt="Imagem do produto"
          width="auto"
          height="auto"
          rel="preload"
          format="webp"
          class="h-full w-full object-contain">
      </aside>
      <span
        v-else
        class="h-[120px] w-[120px] rounded bg-gray-200 shadow"
      ></span>
      <!--  -->
      <!-- Product Infos -->
      <section class="flex flex-col gap-1 text-txt-color">
        <Loading v-if="!isRendered"/>

        <small class="text-blue-500" v-if="!urlSubscription && productStore.isSubscription && isRendered">
          {{ $t("components.product_card.is_subscription") }}
        </small>
        <h1 v-if="isRendered" class="mb-[5px] text-[18px] font-[700] text-input-color">
          {{ product.name }}
        </h1>
        <p
          class="text-lg font-semibold leading-4 text-txt-color"
          :class="{ underline: productStore.hasTrial }"
          v-if="!urlSubscription && productStore.hasTrial && isRendered"
        >
          {{ trialMessage }}
        </p>
        <ProductTotalAmount v-else />
        <ProductCharges v-if="urlSubscription && history_subscription && isRendered"/>
        <!-- Custom Charges -->
        <section
          class="custom_charges"
          v-if="!urlSubscription && !!productStore.hasCustomCharges.length && !exceptionSellerId && isRendered"
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
              <span class="flex-wrap">
                {{ $t("checkout.different_amount_text.other_charges") }}
              </span>
              <span class="min-w-[70px] flex-nowrap text-end">
                {{ formatMoney(product.amount) }}
              </span>
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
    <InfoTrial class="mx-5" v-if="!urlSubscription && trial_position === 'top'" />
    <DonationCampaign v-if="!urlSubscription && product?.seller?.donation_tax" />

    <!-- address event -->
     <section class="flex flex-col gap-3 px-5 pb-5" v-if="product.product_type_id == 3 && sellerHasFeatureTickets">
      <div class="data-container" >
        <img src="../../assets/icons/calendar.svg" alt="calendar">
        <p>
          {{dateEvent}}
        </p>
      </div>
      <div class="data-container" >
        <img src="../../assets/icons/clock.svg" alt="calendar">
        <p>
          {{ horsEvent }}
        </p>
      </div>
      <div class="data-container" >
        <img src="../../assets/icons/location.svg" alt="calendar">
        <p>{{ addressEvent }} </p>
      </div>
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
        <span class="infos-title"
          >{{ $t("components.product_card.warranty")
          }}<span class="md:hidden">:</span></span
        >
        <span class="infos-content"
          >{{ product.warranty }}
          {{ $t("components.product_card.warranty_days") }}</span
        >
      </p>
      <!-- payment update subscription info -->
      <a 
        v-if="urlSubscription"
        class="text-xs text-blue-400"
      >
        {{ $t("components.product_card.payment_update_text") }}
      </a>
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
              ? product.seller.company.fantasy_name || product.seller.company.name
              : product.seller.name
          }}
        </span>
      </p>
      <!-- Email -->
      <p
        class="flex items-center gap-1 md:flex-col md:items-start"
        v-if="product?.seller?.company?.email"
      >
        <span class="infos-title"
          >{{ $t("general.mail") }}<span class="md:hidden">:</span></span
        >
        <span class="infos-content">{{ product.seller.company.email }}</span>
      </p>
      <!-- Cellphone -->
      <p
        class="mb-5 flex items-center gap-2 md:flex-col md:items-start"
        v-if="product?.seller?.company?.support_telephone"
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
      <ProductCoupon 
        :urlSubscription="urlSubscription"
        v-if="(urlSubscription && history_subscription?.coupon) || (!urlSubscription && productStore.allowedCoupon)"
      />
      <ProductCashback />
    </section>
    <EventTimer v-if="product.product_type_id == 3 && sellerHasFeatureTickets"/>
  </BaseCard>
</template>

<style lang="scss" scoped>
.data-container{
  display: flex;
  gap: 12px;
  justify-content: start;
  align-items: center;
  p{
    color: #000001; 
    font-size: 14px; 
    font-family: Montserrat; 
    font-style: normal; 
    font-weight: 400; 
    line-height: 150%;
  }
  img{
    width: 15px; 
    height: 15px;
  }
}
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
