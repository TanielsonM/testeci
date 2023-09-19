<script setup>
import { storeToRefs } from "pinia";
import { usePreCheckoutStore } from "~~/store/preCheckout";
import { useCheckoutStore } from "~~/store/checkout";
import { saleHasStarted, haveAvailableTickets, dependsOnAnotherBatch } from "@/utils/validateBatch";
import moment from "@/plugins/moment.js";

const preCheckout = usePreCheckoutStore();
const checkout = useCheckoutStore();
const { getBatches, loadingReservation } = storeToRefs(preCheckout);
const batches = getBatches?.value || [];

const getTicketInstallments = function (batch_group, ticket_hash) {
  if(!getBatches?.value) return 0;
  const {
    monthly_interest,
    product_id,
    coupon,
    installments,
  } = storeToRefs(checkout);
  const batch = getBatches.value.find(x => x.id === batch_group.id);
  const ticket = batch.tickets.find(x => x?.hash === ticket_hash);

  const getAmount = ticket.selected_tickets * ticket.amount;
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

const dependentBatchName = function (batch) {
  if(!batch?.release_offer_group_stock_id) return '';
  else {
    if(getBatches?.value && Array.isArray(getBatches.value)) {
      const dependentBatch = getBatches.value.find(x => x.id === batch.release_offer_group_stock_id);
      return dependentBatch?.name;
    } else return '';
  }
}

const getSmallerAmount = function (tickets) {
  return Math.min(...tickets.map(x => x.amount));
}
</script>

<template>
  <div class="mb-3">
    <PreCheckoutCard v-for="batch in batches" :key="batch.id" class="mb-5" :class="{'bg-checkout': dependsOnAnotherBatch(batch)}">
      <div
        class="text-txt-color justify-between items-center mt-5"
        :class="{
          'mb-5 block sm:flex': dependsOnAnotherBatch(batch),
          'flex': !dependsOnAnotherBatch(batch)
        }"
      >
        <div class="ml-5">
          <p class="text-[18px] font-bold text-input-color mb-2">{{ batch?.name }}</p>
          <p class="text-[16px] font-[400] text-txt-color">
            A partir de {{ formatMoney(getSmallerAmount(batch.tickets))}}
          </p>
          <p class="text-[14px] font-[400] text-main-color max-w-[330px]">
            <template v-if="dependsOnAnotherBatch(batch)">
              Vendas disponíveis após encerramento do lote: <br> {{ dependentBatchName(batch) }}
            </template>
            <template v-else-if="saleHasStarted(batch)">
              Vendas disponíveis
            </template>
            <template v-else>
              Vendas começarão em {{ moment(batch?.release_fixed_date).format('LLL') }}
            </template>
          </p>
        </div>
        <div v-if="!dependsOnAnotherBatch(batch) && saleHasStarted(batch)" class="mr-5 ml-5 mt-5 sm:ml-0">
          <span class="text-main-color font-bold px-2 py-1 text-[18px] bg-main-transparent rounded-full">
            {{ batch?.available_tickets }}
          </span>
        </div>
        <div v-else class="mr-5 ml-5 mt-5 sm:ml-0">
          <div class="text-center text-[12px] font-[600] text-main-color px-3 py-2 bg-main-transparent rounded-[5px]">
            Disponível em breve
          </div>
        </div>
      </div>
      <ul v-if="!dependsOnAnotherBatch(batch) && saleHasStarted(batch)" class="text-txt-color">
        <li v-for="(ticket, i) in batch.tickets" :key="ticket?.hash" class="mb-6 pt-5 flex justify-between items-center border-[#E5E5E5]" :class="{'border-t': i !== 0}">
          <div class="ml-5" :class="{'line-through': !haveAvailableTickets(batch)}">
            <h5 class="text-[18px] font-bold text-input-color mb-2">{{ ticket?.name }}</h5>
            <p class="text-[16px] font-[400] text-txt-color">{{ formatMoney(ticket?.amount) }} + taxas</p>
            <small class="text-[14px] font-[400] text-main-color">em até {{ ticket?.max_installments ?? 12 }}x de {{ formatMoney(getTicketInstallments(batch, ticket?.hash)) }}</small>
          </div>
          <div v-if="haveAvailableTickets(batch) || (!haveAvailableTickets(batch) && ticket?.selected_tickets > 0)" class="flex items-center mr-5">
            <template v-if="!loadingReservation">
              <Icon
                name="mdi:minus-circle-outline"
                size="20"
                :class="{
                  'text-gray-300': ticket?.selected_tickets === 0 || !saleHasStarted(batch),
                  'text-main-color': ticket?.selected_tickets > 0 && saleHasStarted(batch),
                  'hover:scale-110': ticket?.selected_tickets > 0 && saleHasStarted(batch),
                  'hover:cursor-pointer': ticket.selected_tickets > 0 && saleHasStarted(batch)
                }"
                @click="preCheckout.subTicket(batch, ticket?.hash)"
              />
              <span class="mx-2 font-semibold">{{ ticket?.selected_tickets }}</span>
              <Icon
                name="mdi:plus-circle-outline"
                size="20"
                :class="{
                  'text-gray-300': !haveAvailableTickets(batch) || !saleHasStarted(batch) || dependsOnAnotherBatch(batch),
                  'text-main-color': haveAvailableTickets(batch) && saleHasStarted(batch) && !dependsOnAnotherBatch(batch),
                  'hover:scale-110': haveAvailableTickets(batch) && saleHasStarted(batch) && !dependsOnAnotherBatch(batch),
                  'hover:cursor-pointer': haveAvailableTickets(batch) && saleHasStarted(batch) && !dependsOnAnotherBatch(batch)
                }"
                @click="preCheckout.addTicket(batch, ticket?.hash)"
              />
            </template>
            <template v-else>
              <Icon
                name="mdi:loading"
                size="25"
                class="animate-spin mr-5"
              />
            </template>
          </div>
          <div v-else>
            <span class="mx-2 font-normal text-gray-400">Esgotado</span>
          </div>
        </li>
      </ul>
    </PreCheckoutCard>
  </div>
</template>