<script setup>
// Stores
import { storeToRefs } from "pinia";
import { useCheckoutStore } from "@/store/checkout";
import { usePreCheckoutStore } from "~~/store/preCheckout";
import { useProductStore } from "~~/store/product";
import { useInstallmentsStore } from "~~/store/modules/installments";
import { useGoBackToPrecheckoutStore } from "~~/store/modal/goBackToPrecheckout";

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
  checkoutPayment
} = storeToRefs(checkout);
const { ticketList, isPresentialEvent } = storeToRefs(preCheckout);
const { getInstallments } = storeToRefs(installmentsStore);
const { hasTicketInstallments, product } = storeToRefs(productStore);

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

function openGoBackPreCheckoutModal() {
  const goBackToPrecheckout = useGoBackToPrecheckoutStore();
  goBackToPrecheckout.setShowModal(true);
}
function formatTicketName(ticket){
  return `${ ticket?.selected_tickets }x ${ ticket?.batch_name } - ${ ticket?.ticket_name }`
}
</script>

<template>
  <section class="flex w-full flex-col gap-3 px-5">
    <!-- Shipping -->
    <section
      class="-mt-[9px] flex flex-col items-start md:mt-auto"
      v-if="checkout.hasPhysicalProduct && product?.method !== 'FREE'"
    >
      <span class="infos-title">{{ $t("checkout.event.freight") }}</span>
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
      <p class="infos-title">{{ $t("checkout.event.order_bumps") }}</p>
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
      <div class="flex justify-between w-full">
        <p class="infos-title">{{ $t("checkout.event.tickets") }}</p>
        <div class="btn-edit-tickets text-center ml-3" @click="openGoBackPreCheckoutModal">
          <span class="text-[12px] font-[600]">{{ $t("checkout.event.edit") }}</span>
        </div>
      </div>
      <span
        class="infos-content mt-2 flex w-full items-center justify-between"
        v-for="ticket in ticketList"
        :key="ticket?.id"
      >
        <p>
          {{ formatTicketName(ticket) }}
        </p>
        <p>
          +{{ formatMoney(ticket?.total_amount) }}
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

<style scoped>
.btn-edit-tickets {
  width: 57px;
  height: 25px;
  border-radius: 5px;
  background: rgba(52, 131, 250, 0.10);
  color: #3483FA;
  cursor: pointer;
}

.btn-edit-tickets:hover {
  background: #3483FA;
  color: rgba(52, 131, 250, 0.10);
}
</style>
