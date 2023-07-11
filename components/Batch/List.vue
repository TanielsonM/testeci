<script setup>
import { storeToRefs } from "pinia";
import { usePreCheckoutStore } from "~~/store/preCheckout";
import { useCheckoutStore } from "~~/store/checkout";
import moment from "moment";

const preCheckout = usePreCheckoutStore();
const checkout = useCheckoutStore();
const { getBatchsList } = storeToRefs(preCheckout);

const getTicketInstallments = function (batch_id) {
  const {
    monthly_interest,
    product_id,
    coupon,
    installments,
  } = storeToRefs(checkout);
  const batch = getBatchsList.value.find(x => x.id === batch_id);

  const getAmount = batch.selected_tickets * batch.amount;
  const n = installments.value;
  if (typeof n === "string") n = parseInt(n);
  if (n === 1) return getAmount;
  let total = 0;
  let frete = 0;

  let value = getAmount;
  // Verifica se produto tem frete
  if (!!batch?.has_shipping_fee) {
    frete +=
    batch?.type_shipping_fee === "FIXED"
      ? batch.amount_fixed_shipping_fee
      : batch.shipping?.amount || 0;
  }
  // Verifica se tem cupom
  if (batch.id === parseInt(product_id.value) && coupon.value.applied) {
    value -= coupon.value.amount;
  }
  // Cliente não paga juros
  if (!!batch?.no_interest_installments) {
    total += value;
  }
  // Cliente paga juros
  else {
    let i = parseFloat(monthly_interest.value) / 100;
    total +=
      (value * n) /
      ((Math.pow(i + 1, n) - 1) / (Math.pow(i + 1, n) * i));
  }

  return (total + frete) / n;
}

const saleHasStarted = function (sale_start_date) {
  const today = moment().format('DD/MM/YYYY');
  const saleStartDate = moment(sale_start_date).format('DD/MM/YYYY');
  return today === saleStartDate;
}

</script>

<template>
  <div class="mb-3">
    <ul class="text-txt-color">
      <li v-for="batch in getBatchsList" :key="batch.id" class="mb-6 flex justify-between items-center">
        <div :class="{'line-through': batch?.ticket_quantity === batch?.selected_tickets || !batch?.have_ticket_quantity }">
          <h5 class="text-base font-semibold text-input-color mb-2">{{ batch?.name }}</h5>
          <p class="text-sm">{{ formatMoney(batch?.amount) }} (+ {{ formatMoney(batch?.amount * batch?.fee) }} de taxa)</p>
          <small class="text-main-color">em até {{ batch?.max_installments }}x de {{ formatMoney(getTicketInstallments(batch?.id)) }}</small>
          <p class="text-sm font-normal text-gray-400">
            <template v-if="batch?.immediate_sale || (!batch?.immediate_sale && saleHasStarted(batch?.sales_start_date))">
              Vendas até {{ batch?.has_sale_deadline ? batch?.sale_deadline : 'sem prazo limite' }}
            </template>
            <template v-else>
              Vendas começarão em {{ moment(batch?.sales_start_date).format('DD/MM/YYYY') }}
            </template>
          </p>
        </div>
        <div v-if="batch?.have_ticket_quantity" class="flex items-center">
          <Icon
            name="mdi:minus-circle-outline"
            size="20"
            :class="{
              'text-gray-300': batch?.selected_tickets === 0,
              'text-main-color': batch?.selected_tickets > 0,
              'hover:scale-110': batch?.selected_tickets > 0,
              'hover:cursor-pointer': batch.selected_tickets > 0
            }"
            @click="preCheckout.subTicket(batch?.id)"
          />
          <span class="mx-2 font-semibold">{{ batch?.selected_tickets }}</span>
          <Icon
            name="mdi:plus-circle-outline"
            size="20"
            :class="{
              'text-gray-300': batch?.ticket_quantity === batch?.selected_tickets,
              'text-main-color': batch?.ticket_quantity !== batch?.selected_tickets,
              'hover:scale-110': batch?.ticket_quantity !== batch?.selected_tickets,
              'hover:cursor-pointer': batch?.ticket_quantity !== batch?.selected_tickets
            }"
            @click="preCheckout.addTicket(batch?.id)"
          />
        </div>
        <div v-else>
          <span class="mx-2 font-normal text-gray-400">Esgotado</span>
        </div>
      </li>
    </ul>
  </div>
</template>