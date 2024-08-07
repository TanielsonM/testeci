<script setup>
// Core
import { useCustomCheckoutStore } from "~~/store/customCheckout";
// Utils
import { formatMoney } from "~/utils/money";
import { useProductStore } from "~~/store/product";

import { MdPreview } from 'md-editor-v3';

import * as Toast from "vue-toastification";


const productStore = useProductStore();
const { product } = storeToRefs(productStore);

const { t } = useI18n();
const customCheckout = useCustomCheckoutStore();
const props = defineProps({
  bump: {
    type: Object,
    required: true,
    default: () => {},
  },
  amount: {
    type: [String, Number],
    required: true,
    default: () => 0,
  },
  hasCustomCharges: {
    type: [Function, Boolean],
    required: false,
    default: () => ({}),
  },
  trialMessage: {
    type: String,
    required: false,
    default: () => "",
  },
  trialMessageAlternative: {
    type: String,
    required: false,
    default: () => "",
  },
  shipping: {
    type: Object,
    required: false,
    default: () => ({}),
  },
  shippingOptions: {
    type: Array,
    required: false,
    default: () => [],
  },
  shippingLoading: {
    type: Boolean,
    required: false,
    default: () => false,
  },
  hasShippingFee: {
    type: Boolean,
    required: false,
    default: () => false,
  },
  installmentString: {
    type: String,
    required: false,
    default: () => "",
  },
});
const details = ref(false);

const toast = Toast.useToast();

const redirect = () => { 
  if (props.bump.links.length && props.bump.links[0].url) {
    let url = props.bump.links[0].url
    if (!url.startsWith('http://') && !url.startsWith('https://')) {
      url = 'https://' + url
    }
    window.open(url, '_blank')
  } else {   
    toast.info(`${t("checkout.link_vendedor_nao_encontrado")}`);
  }
};
  
// Computeds
const hasTrial = computed(() => !!props.bump.trial);
const isBumpSellerEqual = computed(() => {
  return product.value.seller.id == props.bump.seller.id;
});

const showDescription = computed(() =>
  customCheckout.hasCustomBump ? customCheckout.bump_options.description : true
);

const exceptionSellerId = computed(() => {
  if(useRuntimeConfig().public.CUSTOM_CHARGES_EXCEPTION) {
    const ids = JSON.parse(useRuntimeConfig().public.CUSTOM_CHARGES_EXCEPTION)
    return ids.some(x => parseInt(x) === parseInt(product.value.seller.id))
  }
  return false
})

// Methods
function getType(type = "") {
  switch (type) {
    case "SUBSCRIPTION":
      return t("checkout.pagamento.bump.signature");
    default:
      return '';
  }
}
</script>

<template>
  <section class="body h-full w-full">
    <section class="content flex flex-col md:flex-row">
      <!-- Image, type and detail button -->
      <section class="left__side">
        <section v-if="!bump.images.length" class="no-image"></section>
        <img
          v-else
          :src="bump.images[0].path"
          alt="logo"
          height="100%"
          width="100%"
        />
        <section class="type-and-details">
          <span class="item-info">
            {{ getType(bump.type) }}
          </span>
          <button
            class="item-details"
            @click.stop.prevent="details = !details"
            v-if="bump.type !== 'TRANSACTION'"
          >
            {{
              details
                ? $t("checkout.pagamento.bump.hide")
                : $t("checkout.pagamento.bump.details")
            }}
          </button>
        </section>
      </section>
      <!-- More product infos -->
      <section class="right__side" :class="`${bump.type.toLowerCase()}`">
        <div class="bump-product-title">
          <h1 class="item-title text-txt-color">{{ bump.offer_name }}</h1>

          <div v-show="!isBumpSellerEqual" class='has-tooltip' @click="redirect">
            <span class='tooltip absolute rounded shadow-lg p-2 bg-black text-white bg-opacity-75 text-sm -mt-12 mr-8 w-full sm:w-64 md:w-80 text-center left-1/2 transform -translate-x-1/2'>  
              {{$t("checkout.venda_por_indicacao")}}  
             
            </span>
            <span class="different-seller">
              Autor: {{ bump.seller.company ? bump.seller.company.fantasy_name ||
                bump.seller.company.name
              : bump.seller.name
             }}</span>        
          </div>
        </div>

        <template v-if="hasTrial">
          <p class="info-value custom-color">
            {{ trialMessage }}
          </p>
          <span class="trial-info">
            {{ trialMessageAlternative }}: {{ `${formatMoney(amount)}` }}/
            {{ $t("checkout.pagamento.bump.month") }}
          </span>
        </template>
        <Transition name="fade" mode="out-in">
          <section class="hide-details" v-if="!details" key="hide-details">
            <span
              v-if="!hasTrial && !hasCustomCharges"
              class="info-value custom-color"
              >{{ installmentString }}</span
            >
            <section class="charges" :opened="details" v-if="hasCustomCharges && !exceptionSellerId">
              <p
                v-for="charge in customCharges"
                :key="charge.id"
                class="w-100 d-flex justify-content-between"
              >
                <span
                  >{{ charge.sequence }}ª
                  {{ $t("checkout.different_amount_text.charge") }}</span
                >
                <span>{{ `${formatMoney(charge.amount)}` }}</span>
              </p>
              <p class="w-100 d-flex justify-content-between">
                <span class="text-wrap pr-2">{{
                  $t("checkout.different_amount_text.other_charges")
                }}</span>
                <span>{{ `${formatMoney(bump.amount)}` }}</span>
              </p>
            </section>
            <section
              class="item-info text-wrap trial-info my-2 text-left"
              v-if="hasShippingFee && bump.shipping_fee_is_recurring === 0"
            >
              {{ $t("checkout.recurring_shipping.isNotRecurring") }}
            </section>
          </section>
          <section class="show-details" v-else key="show-details">
            <section class="details" v-if="!hasCustomCharges">
              <span class="info-value-400">{{
                $t("checkout.pagamento.bump.product")
              }}</span>
              <span class="info-value-400">
                {{ `${formatMoney(amount)}` }}
              </span>
            </section>
            <section class="charges" :opened="details" v-else>
              <p
                v-for="charge in customCharges"
                :key="charge.id"
                class="w-100 d-flex justify-content-between"
              >
                <span
                  >{{ charge.sequence }}ª
                  {{ $t("checkout.different_amount_text.charge") }}</span
                >
                <span>{{ `${formatMoney(charge.amount)}` }}</span>
              </p>
              <p class="w-100 d-flex justify-content-between">
                <span class="text-wrap pr-2">{{
                  $t("checkout.different_amount_text.other_charges")
                }}</span>
                <span>{{ `${formatMoney(bump.amount)}` }}</span>
              </p>
            </section>
            <section class="details" v-if="hasShippingFee">
              <span class="info-value-400">Frete</span>
              <span class="info-value-400">
                {{
                  shipping.price
                    ? `${formatMoney(parseFloat(shipping.price))}`
                    : shipping.price === 0
                    ? $t("checkout.pagamento.bump.free")
                    : $t("checkout.pagamento.bump.to_calculate")
                }}
              </span>
            </section>
          </section>
        </Transition>
        <MdPreview v-model="bump.description" style="background-color: transparent;" class="item-description" v-if="showDescription" />
      </section>
    </section>
    <section class="!block w-full" v-if="bump.checkbox">
      <FormShippingOption
        :options="bump.shipping_options ?? []"
        :is-bump="true"
        :bump="bump.id"
        class="mt-5"
      />
    </section>
  </section>
</template>

<style lang="scss" scoped>
.content {
  display: flex;
  width: 100%;
  height: 100%;
  gap: 30px;

  .left__side,
  .right__side,
  .hide-details,
  .show-details {
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    justify-content: flex-start;
    width: 100%;
    height: 100%;
    gap: 10px;

    &:not(.show-details) {
      gap: 15px;
    }
  }

  .left__side {
    max-width: 100px;

    .no-image {
      width: 100px;
      height: 120px;
      border-radius: 5px;
      background: var(--bg);
      box-shadow: 0 4px 30px rgba(0, 0, 0, 0.1);
      backdrop-filter: blur(6.9px);
      -webkit-backdrop-filter: blur(6.9px);
    }

    img {
      object-fit: contain;
      border-radius: 5px;
      width: 100px;
    }

    .item-info {
      font-family: "Montserrat";
      font-style: normal;
      font-weight: 600;
      font-size: 13px;
      line-height: 15px;
      color: var(--font-color-body);
    }

    .item-details {
      font-family: "Montserrat";
      font-style: normal;
      font-weight: 500;
      font-size: 13px;
      line-height: 15px;
      text-decoration-line: underline;
      color: var(--txt-color);
      background: transparent;
      border: none;

      padding: 0;
      transition: ease-in-out 200ms;
      cursor: pointer;

      &:hover {
        transform: scale3d(1.1, 1.1, 1.1);
      }
    }

    .type-and-details {
      display: flex;
      flex-direction: column;
      align-items: flex-start;
      gap: 20px;
    }

    @media (max-width: 768px) {
      & {
        max-width: 100%;
      }
      .item-info {
        font-size: 15px;
      }
      .item-details {
        font-size: 15px;
        text-align: right;
      }

      .type-and-details {
        display: flex;
        flex-direction: row;
        width: 100%;
        justify-content: space-between;
        align-items: center;
      }
    }
  }

  .right__side {
    .item-title {
      font-family: "Montserrat";
      font-style: normal;
      font-weight: 600;
      font-size: 14px;
      line-height: 17px;
      color: var(--txt-color);
    }

    .trial-info {
      background: var(--background-body);
      border-radius: 5px;
      padding: 10px 15px;
      font-family: "Montserrat";
      font-style: normal;
      font-weight: 600;
      font-size: 12px;
      line-height: 15px;
      color: var(--font-color-body);
    }

    .item-description {
      font-family: "Montserrat";
      font-style: normal;
      font-weight: 400;
      font-size: 13px;
      line-height: 150%;
      color: #81858e;
      text-align: justify;
    }

    .details {
      width: 100%;
      display: flex;
      justify-content: space-between;
    }
  }
}

.info-value-400 {
  color: var(--txt-color);
  letter-spacing: 0.2px;
  font-size: 14px;
  font-weight: 400;
}

.custom-color {
  color: var(--font-color-body);
  font-weight: 600;
}
.bump-product-title{
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
  .different-seller{
    display: flex;
    align-items: center;
    gap: 5px;
    font-size: 12px;
    font-weight: 600;
    color: var(--font-color-body);
    background-color: var(--background-body);
    border-radius: 5px;
    padding: 10px;
    &:hover {
        transform: scale3d(1.1, 1.1, 1.1);
        transition: ease-in-out 300ms;
        background-color: var(--background-header);
        color: white;
        cursor: pointer;
      }
  }
}
</style>
