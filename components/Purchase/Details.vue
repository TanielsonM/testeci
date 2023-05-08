<script setup>
// Stores
import { storeToRefs } from "pinia";
import { useCheckoutStore } from "@/store/checkout";
import { useInstallmentsStore } from "~~/store/modules/installments";
import { useAmountStore } from "~~/store/modules/amount";

// Utils
import { formatMoney } from "~~/utils/money";

const checkout = useCheckoutStore();
const product = useProductStore();
const installmentsStore = useInstallmentsStore();
const {
  coupon,
  method,
  installments,
  hasFees,
  bump_list,
  hasSelectedBump,
  checkoutPayment,
} = storeToRefs(checkout);
const { getInstallments } = storeToRefs(installmentsStore);
const { hasTicketInstallments } = storeToRefs(product);

function formatAmountText(installments = 1) {
  return `${installments}x de ${formatMoney(
    getInstallments.value(installments)
  )} ${hasFees.value ? "" : "(Sem juros)"}`;
}

/* computeds */
const amountText = computed(() => {
  if (method.value === "BOLETO" && hasTicketInstallments.value > 1) {
    return formatAmountText(ticket_installments.value);
  }

  if (["CREDIT_CARD", "TWO_CREDIT_CARDS"].includes(method.value)) {
    return formatAmountText(installments.value);
  }

  return `${formatMoney(getInstallments.value(1))}`;
});
</script>

<template>
  <section class="flex w-full flex-col gap-3 px-5">
    <!-- Shipping -->
    <section
      class="flex flex-col items-start gap-1"
      v-if="checkout.hasPhysicalProduct()"
    >
      <span class="infos-title">Frete</span>
      <span
        class="infos-content flex w-full items-center justify-between"
        v-for="(item, index) in checkout.shippingProducts()"
        :key="index"
      >
        <p>{{ item.name }}</p>
        <p class="min-w-fit">
          {{
            !item.has_shipping_fee
              ? $t("checkout.pagamento.bump.free")
              : item?.shipping?.amount
              ? "+" + formatMoney(item.shipping.amount)
              : item?.shipping?.amount === 0
              ? $t("checkout.pagamento.bump.free")
              : $t("checkout.pagamento.bump.to_calculate")
          }}
        </p>
      </span>
    </section>
    <!-- Order bumps -->
    <section class="flex flex-col items-start gap-1" v-if="hasSelectedBump">
      <p class="infos-title">Order Bumps</p>
      <span
        class="infos-content flex w-full items-center justify-between"
        v-for="(bump, index) in bump_list.filter((i) => i.checkbox)"
        :key="index"
      >
        <p>{{ bump.name }}</p>
        <p>
          {{
            formatMoney(
              bump.custom_charges.length
                ? bump.custom_charges[0].amount
                : bump.amount
            )
          }}
        </p>
      </span>
    </section>
    <!-- Coupon -->
    <section
      class="flex flex-col items-start gap-1"
      v-if="coupon.applied && coupon.amount > 0"
    >
      <span class="infos-title">{{ $t("checkout.cupom.cupom") }}</span>
      <span class="infos-content flex w-full items-center justify-between">
        <p>{{ coupon.name.toUpperCase() }}</p>
        <p>-{{ formatMoney(coupon.amount) }}</p>
      </span>
    </section>
    <!-- Tax -->
    <section
      class="flex flex-col items-start justify-between gap-1"
      v-if="
        typeof checkoutPayment.price === 'object' &&
        checkoutPayment.price.tax.length > 0
      "
    >
      <span class="infos-title">
        {{ $t("order.country_taxs") }}
      </span>
      <span
        class="infos-content flex w-full items-center justify-between"
        v-for="(tax, index) in checkoutPayment.price.tax"
        :key="'tax_' + index"
      >
        <p>{{ tax.description }}</p>
        <p>+{{ formatMoney(tax.local_amount) }}</p>
      </span>
    </section>
    <!-- Total -->
    <section
      class="flex items-start justify-between gap-1"
      v-if="
        hasSelectedBump ||
        coupon.applied ||
        (typeof checkoutPayment.price === 'object' &&
          checkoutPayment.price.tax.length > 0)
      "
    >
      <span class="infos-title">Total</span>
      <span class="small-text text-xs">{{ amountText }}</span>
    </section>
  </section>
</template>
