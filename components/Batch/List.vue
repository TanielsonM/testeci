<script setup>
import { storeToRefs } from "pinia";
import { usePreCheckoutStore } from "~~/store/preCheckout";
import { useCheckoutStore } from "~~/store/checkout";
import { saleHasStarted, haveAvailableTickets } from "@/utils/validateBatch";
import moment from "moment";

const preCheckout = usePreCheckoutStore();
const checkout = useCheckoutStore();
const { getBatchsList } = storeToRefs(preCheckout);

const getTicketInstallments = function (batch_hash) {
  if(!getBatchsList?.value) return 0;
  const {
    monthly_interest,
    product_id,
    coupon,
    installments,
  } = storeToRefs(checkout);
  const batch = getBatchsList.value.find(x => x?.hash === batch_hash);

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
  if (batch?.product_id === parseInt(product_id.value) && coupon.value.applied) {
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

</script>

<template>
  <div class="mb-3">
    <ul class="text-txt-color">
      <li v-for="batch in getBatchsList" :key="batch?.hash" class="mb-6 flex justify-between items-center">
        <div :class="{'line-through': batch?.have_ticket_quantity && batch?.selected_tickets >= batch?.tickets}">
          <h5 class="text-base font-semibold text-input-color mb-2">{{ batch?.name }}</h5>
          <p class="text-sm">{{ formatMoney(batch?.amount) }}</p>
          <!-- (+ {{ formatMoney(batch?.amount * batch?.fee) }} de taxa) -->
          <small class="text-main-color">em até {{ batch?.max_installments ?? 12 }}x de {{ formatMoney(getTicketInstallments(batch?.hash)) }}</small>
          <p class="text-sm font-normal text-gray-400">
            <template v-if="saleHasStarted(batch)">
              Vendas até {{ batch?.has_sale_deadline ? moment(batch?.sale_deadline).format('DD/MM/YYYY') : 'sem prazo limite' }}
            </template>
            <template v-else>
              Vendas começarão em {{ moment(batch?.sales_start_date).format('DD/MM/YYYY') }}
            </template>
          </p>
        </div>
        <div v-if="batch?.have_ticket_quantity && batch?.tickets > 0" class="flex items-center">
          <Icon
            name="mdi:minus-circle-outline"
            size="20"
            :class="{
              'text-gray-300': batch?.selected_tickets === 0 || !saleHasStarted(batch),
              'text-main-color': batch?.selected_tickets > 0 && saleHasStarted(batch),
              'hover:scale-110': batch?.selected_tickets > 0 && saleHasStarted(batch),
              'hover:cursor-pointer': batch.selected_tickets > 0 && saleHasStarted(batch)
            }"
            @click="preCheckout.subTicket(batch?.hash)"
          />
          <span class="mx-2 font-semibold">{{ batch?.selected_tickets }}</span>
          <Icon
            name="mdi:plus-circle-outline"
            size="20"
            :class="{
              'text-gray-300': !haveAvailableTickets(batch) || !saleHasStarted(batch),
              'text-main-color': haveAvailableTickets(batch) && saleHasStarted(batch),
              'hover:scale-110': haveAvailableTickets(batch) && saleHasStarted(batch),
              'hover:cursor-pointer': haveAvailableTickets(batch) && saleHasStarted(batch)
            }"
            @click="preCheckout.addTicket(batch?.hash)"
          />
        </div>
        <div v-else>
          <span class="mx-2 font-normal text-gray-400">Esgotado</span>
        </div>
      </li>
    </ul>
  </div>
</template>