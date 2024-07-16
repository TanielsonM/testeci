<script setup>
import { storeToRefs } from "pinia";
import { usePreCheckoutStore } from "~~/store/preCheckout";
import { useCheckoutStore } from "~~/store/checkout";
import { saleHasStarted, haveAvailableTickets, dependsOnAnotherBatch } from "@/utils/validateBatch";
import { useRoute } from 'vue-router'

const { $moment } = useNuxtApp();

const preCheckout = usePreCheckoutStore();
const checkout = useCheckoutStore();
const { getBatches } = storeToRefs(preCheckout);
const batches = getBatches?.value || [];

const getTicketInstallments = function (batch_group, ticket_hash) {
  if (!getBatches?.value) return 0;
  const {
    monthly_interest,
    product_id,
    coupon,
    installments,
  } = storeToRefs(checkout);
  const batch = getBatches.value.find(x => x.id == batch_group.id);
  const ticket = batch.tickets.find(x => x?.hash === ticket_hash);

  const getAmount = ticket.selected_tickets * ticket.amount;
  let n = installments.value;
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
  if (batch?.product_id == parseInt(product_id.value) && coupon.value.applied) {
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
  if (!batch?.release_offer_group_stock_id) return '';
  else {
    if (getBatches?.value && Array.isArray(getBatches.value)) {
      const dependentBatch = getBatches.value.find(x => x.id == batch.release_offer_group_stock_id);
      return dependentBatch?.name;
    } else return '';
  }
}

const getSmallerAmount = function (tickets) {
  return Math.min(...tickets.map(x => x.amount));
}

const hasFixedBatch = () => {
  const url = useRoute();

   if (Object.keys(url.query).length === 0){
    return batches;
  }

  let collection = [];
  let searchParams = new URLSearchParams(url.query);
  let batcheRegex = new RegExp("(bt_id_)(\\d*$)", "i");

  searchParams.forEach((value, key) => {
    let matches = key.match(batcheRegex);
    if(!matches){
      return;
    }
    if (matches) {
      let offer = batches.find(batch => batch.id == value);
      if(offer){
        collection.push(offer)
      }
    }
  });

  collection.sort((a, b) => {
    if (a.order < b.order) return -1;
    if (a.order > b.order) return 1;
    return 0;
  });

  return batches.value = (collection.length ? collection : batches) || [];
}

function verifyIfHasSoldOffField(id) {
  let filter = batches.find(x => x.id == id)

  if(filter && filter?.soldOff)
    return false

  return true
}

function validateMinusBtn(ticket, batch, disabled = false) {
  if(disabled && ticket?.selected_tickets === 0 || !saleHasStarted(batch)) {
    return true
  } else if(!disabled && ticket?.selected_tickets > 0 && saleHasStarted(batch)) {
    return true
  }
  return false
}

function validatePlusBtn(batch, disabled = false) {
  if(disabled && !haveAvailableTickets(batch) || !saleHasStarted(batch) || dependsOnAnotherBatch(batch) || batch.release_type === null) {
    return true
  } else if(!disabled && haveAvailableTickets(batch) && saleHasStarted(batch) && !dependsOnAnotherBatch(batch) || batch.release_type === null) {
    return true
  }
  return false
}

onMounted(async () => {
  const route = useRoute();
  setTimeout(async () => {
    for (const key in route.query) {
      if (key.startsWith('o_')) {
        const offerHash = key.slice(2);
        const howManyTicketsToPreSelect = route.query[key];
        
        for (const batch of batches.value) {
          for (const ticket of batch.tickets) {
            if (ticket.hash === offerHash) {
              for (let i = 0; i < howManyTicketsToPreSelect; i++) {
                await preCheckout.addTicket(batch, offerHash);
              }
            }
          }
        }
      }
    }
  },1500)
});

</script>

<template>
  <div class="mb-3">
    <PreCheckoutCard v-for="(batch, index) in hasFixedBatch()" :key="batch.id" class="mb-5" :class="{ 'bg-checkout': dependsOnAnotherBatch(batch) }">
      <div class="text-txt-color justify-between items-center mt-5" :class="{
        'mb-5 block sm:flex': dependsOnAnotherBatch(batch),
        'flex': !dependsOnAnotherBatch(batch)
      }">
        <div class="ml-5">
          <p class="text-[18px] font-bold text-input-color mb-2">{{ batch?.name }}</p>
          <p class="text-[16px] font-[400] text-txt-color">
            {{ $t("pre_checkout.from") }}
            {{ formatMoney(getSmallerAmount(batch.tickets)) }}
          </p>
          <p class="text-[14px] font-[400] text-main-color max-w-[330px]">
            <template v-if="dependsOnAnotherBatch(batch)">
              {{ $t("pre_checkout.sales_available_batch") }} <br> {{ dependentBatchName(batch) }}
            </template>
            <template v-else-if="saleHasStarted(batch)">
              {{ $t("pre_checkout.sales_available") }}
            </template>
            <template v-else>
              {{ $t("pre_checkout.sales_start_in") }} {{ $moment(batch?.release_fixed_date).format('LLL') }}
            </template>
          </p>
        </div>
        <div v-if="!dependsOnAnotherBatch(batch) && saleHasStarted(batch) && batch?.selected_batch_tickets > 0" class="mr-5 ml-5 mt-5 sm:ml-0">
          <span class="text-main-color font-bold px-2 py-1 text-[18px] bg-main-transparent rounded-full">
            {{ batch?.selected_batch_tickets }}
          </span>
        </div>
        <div v-else-if="(!dependsOnAnotherBatch(batch) && !saleHasStarted(batch) || dependsOnAnotherBatch(batch) && saleHasStarted(batch))" class="mr-5 ml-5 mt-5 sm:ml-0">
          <div class="text-center text-[12px] font-[600] text-main-color px-3 py-2 bg-main-transparent rounded-[5px]">
            {{ $t("pre_checkout.available_soon") }}
          </div>
        </div>
      </div>
      <ul v-if="!dependsOnAnotherBatch(batch) && saleHasStarted(batch)" class="text-txt-color">
        <li v-for="(ticket, i) in batch.tickets" :key="ticket?.hash" class="mb-6 pt-5 flex justify-between items-center border-[#E5E5E5]" :class="{ 'border-t': i !== 0 }">
          <div class="ml-5" :class="{ 'line-through': batch.release_type !== 'fixed_date' && !haveAvailableTickets(batch) && batch.release_type !== null }">
            <h5 class="text-[18px] font-bold text-input-color mb-2">{{ ticket?.name }}</h5>
            <p class="text-[16px] font-[400] text-txt-color">{{ formatMoney(ticket?.amount) }}</p>
            <small v-if="ticket?.selected_tickets > 0" class="text-[14px] font-[400] text-main-color">
              {{ $t("pre_checkout.in_until") }} {{ ticket?.max_installments ?? 12 }}x de {{ formatMoney(getTicketInstallments(batch, ticket?.hash)) }}
            </small>
          </div>
          <div 
            v-if="
              verifyIfHasSoldOffField(batches[index].id) ||
              batch.release_type === 'fixed_date' && haveAvailableTickets(batch) || 
              (!haveAvailableTickets(batch) && ticket?.selected_tickets > 0) ||
              batch.release_type === null"
              class="flex items-center mr-5"
          >
            <template v-if="!ticket.load">
              <Icon name="mdi:minus-circle-outline" size="20" :class="{
                'text-gray-300': validateMinusBtn(ticket, batch, true),
                'text-main-color': validateMinusBtn(ticket, batch),
                'hover:scale-110': validateMinusBtn(ticket, batch),
                'hover:cursor-pointer': validateMinusBtn(ticket, batch)
              }" @click="preCheckout.subTicket(batch, ticket?.hash)" />
              <span class="mx-2 font-semibold">{{ ticket?.selected_tickets }}</span>
              <Icon name="mdi:plus-circle-outline" size="20" :class="{
                'text-gray-300': validatePlusBtn(batch, true),
                'text-main-color': validatePlusBtn(batch),
                'hover:scale-110': validatePlusBtn(batch),
                'hover:cursor-pointer': validatePlusBtn(batch)
              }" @click="preCheckout.addTicket(batch, ticket?.hash)" />
            </template>
            <template v-else>
              <Icon name="mdi:loading" size="25" class="animate-spin mr-5" />
            </template>
          </div>
          <div v-else>
            <span class="mx-2 font-normal text-gray-400">{{ $t("pre_checkout.sold_off") }}</span>
          </div>
        </li>
      </ul>
    </PreCheckoutCard>
  </div>
</template>
