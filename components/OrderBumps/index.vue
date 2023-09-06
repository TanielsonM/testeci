<script setup>
// Core
import { useCustomCheckoutStore } from "~~/store/customCheckout";
import { useCheckoutStore } from "~~/store/checkout";
// Utils
import { formatMoney } from "~/utils/money";

const { t } = useI18n();
const props = defineProps({
  bump: {
    type: Object,
    required: true,
    default: () => {},
  },
});
const checkoutStore = useCheckoutStore();
const checkout = useCustomCheckoutStore();

const shipping = ref({});
const shippingOptions = ref([]);
const shippingLoading = ref(false);

// Computed methods
const stylesheet = computed(() => ({
  "--background-header": checkout.hasCustomBump
    ? checkout.bump_options.background_color.color
    : "#ff0c37",
  "--background-body": checkout.hasCustomBump
    ? checkout.bump_options.background_color.background
    : "rgba(255, 12, 55, 0.1)",
  "--font-color-body": checkout.hasCustomBump
    ? checkout.bump_options.background_color.color
    : "#ff0c37",
  "--border-body-type": checkout.hasCustomBump
    ? checkout.bump_options.border !== "off"
      ? checkout.bump_options.border === "pontilhada"
        ? `dashed`
        : `solid`
      : "none"
    : "none",
  "--border-body-color": checkout.hasCustomBump
    ? checkout.bump_options.background_color.color
    : "",
  "--border-body-width": checkout.hasCustomBump
    ? `${checkout.bump_options.border_px}px`
    : "0",
}));
const hasCustomCharges = computed(() => {
  if (props.bump.custom_charges) return !!props.bump.custom_charges.length;
  return false;
});
const trialMessage = computed({
  get() {
    if (props.bump.trial === 1) {
      return `${t("checkout.pagamento.bump.free_for")} ${props.bump.trial} ${t(
        "checkout.pagamento.bump.day"
      )}.`;
    }
    return `${t("checkout.pagamento.bump.free_for")} ${props.bump.trial} ${t(
      "checkout.pagamento.bump.day"
    )}s.`;
  },
});
const trialMessageAlternative = computed({
  get() {
    if (props.bump.trial === 1) {
      return `${t("checkout.pagamento.bump.after_trial_period")} ${
        props.bump.trial
      } ${t("checkout.pagamento.bump.day")}`;
    }
    return `${t("checkout.pagamento.bump.after_trial_period")} ${
      props.bump.trial
    } ${t("checkout.pagamento.bump.day")}s`;
  },
});
const amount = computed(() =>
  hasCustomCharges.value
    ? props.bump.custom_charges[0].amount
    : props.bump.amount
);
const hasShippingFee = computed(() => !!props.bump.has_shipping_fee);
const isFixedShipping = computed(
  () => props.bump.type_shipping_fee === "FIXED"
);

// Watches
watch(
  () => props.bump.checkbox,
  () => {
    checkoutStore.setProductList(props.bump);
  }
);

if (isFixedShipping.value)
  shipping.value = { price: props.bump.amount_fixed_shipping_fee };
</script>

<template>
  <BaseCard class="order-bump-card" :style="stylesheet">
    <header
      class="flex h-[50px] w-full items-center justify-between rounded-t-lg bg-red-600"
    >
      <BaseCheckbox
        :id="bump.id"
        v-model:checked="bump.checkbox"
        :label="
          checkout.hasCustomBump
            ? checkout.bump_options.subtitle
            : $t('checkout.pagamento.bump.yes_i_want')
        "
        label-custom-class="text-white"
      />
      <p class="item-value">
        {{ !!bump.trial ? trialMessage : formatMoney(amount) }}
      </p>
    </header>
    <OrderBumpsBody
      :bump="bump"
      :amount="amount"
      :shipping="shipping"
      :shipping-options="shippingOptions"
      :shipping-loading="shippingLoading"
      :trial-message="trialMessage"
      :trial-message-alternative="trialMessageAlternative"
      :has-shipping-fee="hasShippingFee"
      :has-custom-charges="hasCustomCharges"
    />
  </BaseCard>
</template>

<style lang="scss" scoped>
.order-bump-card {
  gap: 0 !important;
  header {
    width: 100%;
    height: 50px;
    background: var(--background-header);
    border-radius: 5px 5px 0px 0px;
    padding: 0px 30px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    user-select: none;
  }
  .body {
    width: 100%;
    border-radius: 0px 0px 5px 5px;
    padding: 30px 35px;
    background: var(--background-body);
    user-select: none;
    border: var(--border-body-width);
    border-style: var(--border-body-type);
    border-color: var(--border-body-color);
    border-top: none;
  }
}

.item-value {
  flex-wrap: wrap;
  font-size: 0.875rem /* 14px */;
  line-height: 1.25rem /* 20px */;
  font-weight: 600;
  color: white;
}
</style>
