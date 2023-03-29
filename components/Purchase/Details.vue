<script setup>
// Stores
import { storeToRefs } from "pinia";
import { useCheckoutStore } from "@/store/checkout";
// Utils
import { formatMoney } from "~~/utils/money";

const checkout = useCheckoutStore();
const {
  coupon,
  method,
  installments,
  getInstallments,
  hasFees,
  bump_list,
  hasSelectedBump,
} = storeToRefs(checkout);

const amountText = computed(() => {
  switch (method.value) {
    case "CREDIT_CARD":
      return `${installments.value}x de ${formatMoney(
        getInstallments.value()
      )} ${hasFees.value ? "(Sem juros)" : ""}`;
    default:
      return `${formatMoney(getInstallments.value())}`;
  }
});
</script>

<template>
  <section class="flex w-full flex-col gap-3 px-5">
    <!-- Shipping -->
    <p
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
    </p>
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
    <p
      class="flex flex-col items-start gap-1"
      v-if="coupon.applied && coupon.amount > 0"
    >
      <span class="infos-title">{{ $t("checkout.cupom.cupom") }}</span>
      <span class="infos-content flex w-full items-center justify-between">
        <p>{{ coupon.name.toUpperCase() }}</p>
        <p>-{{ formatMoney(coupon.amount) }}</p>
      </span>
    </p>
    <!--  -->
    <!-- Total -->
    <p class="flex items-start justify-between gap-1" v-if="coupon.applied">
      <span class="infos-title">Total</span>
      <span class="small-text text-xs">{{ amountText }}</span>
    </p>
  </section>
</template>
