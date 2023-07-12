<script setup>
// Stores
import { storeToRefs } from "pinia";
import { useCheckoutStore } from "@/store/checkout";
import { usePreCheckoutStore } from "~~/store/preCheckout";
import { useProductStore } from "~~/store/product";
import { useInstallmentsStore } from "~~/store/modules/installments";

// Utils
import { formatMoney } from "~~/utils/money";

const checkout = useCheckoutStore();
const preCheckout = usePreCheckoutStore();
const productStore = useProductStore();
const installmentsStore = useInstallmentsStore();
const {
  coupon,
  method,
  installments,
  hasFees,
  bump_list,
  hasSelectedBump,
  checkoutPayment,
  product_list
} = storeToRefs(checkout);
const { getBatchsList, isPresentialEvent } = storeToRefs(preCheckout);
const { getInstallments } = storeToRefs(installmentsStore);
const { hasTicketInstallments } = storeToRefs(productStore);

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
      class="-mt-[9px] flex flex-col items-start md:mt-auto"
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
    <section
      class="-mt-[9px] flex flex-col items-start md:mt-auto"
      v-if="hasSelectedBump"
    >
      <p class="infos-title">Order Bumps</p>
      <span
        class="infos-content mt-2 flex w-full items-center justify-between"
        v-for="(bump, index) in bump_list.filter((i) => i.checkbox)"
        :key="index"
      >
        <p>{{ bump.name }}</p>
        <p>
          +{{
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
      class="-mt-[9px] flex flex-col items-start md:mt-auto"
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
      class="-mt-[9px] flex flex-col items-start justify-between md:mt-auto"
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
    <!-- Event Tickets -->
    <section
      class="-mt-[9px] flex flex-col items-start md:mt-auto"
      v-if="isPresentialEvent"
    >
      <p class="infos-title">Ingressos</p>
      <span
        class="infos-content mt-2 flex w-full items-center justify-between"
        v-for="batch in product_list"
        :key="batch?.hash"
      >
        <p>{{ batch?.name }}</p>
        <p>
          +{{ formatMoney(batch?.amount) }}
        </p>
      </span>
    </section>
    <!-- Total -->
    <section
      class="flex items-start justify-between"
      v-if="
        hasSelectedBump ||
        coupon.applied ||
        isPresentialEvent ||
        (typeof checkoutPayment.price === 'object' &&
          checkoutPayment.price.tax.length > 0)
      "
    >
      <span class="infos-title">Total</span>
      <span class="small-text text-xs">{{ amountText }}</span>
    </section>
  </section>
</template>
