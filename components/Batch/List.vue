<script setup>
import { storeToRefs } from "pinia";
import { usePreCheckoutStore } from "~~/store/preCheckout";
import { useCheckoutStore } from "~~/store/checkout";
import { saleHasStarted, haveAvailableTickets, dependsOnAnotherBatch } from "@/utils/validateBatch";
import moment from "moment";

const preCheckout = usePreCheckoutStore();
const checkout = useCheckoutStore();
const { getGroups, getBatchsList, loadingReservation } = storeToRefs(preCheckout);

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

const dependentGroupName = function (batch) {
  if(!batch?.product_has_offer_id) return '';
  else {
    if(getBatchsList?.value && Array.isArray(getBatchsList.value)) {
      const dependentBatch = getBatchsList.value.find(x => x.id === batch.product_has_offer_id);
      return dependentBatch?.name;
    } else return '';
  }
}
</script>

<template>
  <div class="mb-3">
    <PreCheckoutCard v-for="group in getGroups" :key="group.id" class="mb-5" :class="{'bg-checkout': group?.dependent_batch}"> 
      <div class="text-txt-color flex justify-between items-center mt-5" :class="{'mb-5': group?.dependent_batch}">
        <div class="ml-5">
          <p class="text-[18px] font-bold text-input-color mb-2">{{ group?.name }}</p>
          <p class="text-[16px] font-[400] text-txt-color">
            A partir de R$ 157,20
          </p>
          <p class="text-[14px] font-[400] text-main-color">
            <template v-if="dependsOnAnotherBatch(group)">
              Vendas disponíveis após esgotamento do lote: <br> {{ dependentGroupName(group) }}
            </template>
            <template v-else-if="saleHasStarted(group)">
              Vendas {{ group?.has_sale_deadline ? `até ${moment(group?.sale_deadline).format('DD/MM/YYYY')}` : 'sem prazo limite' }}
            </template>
            <template v-else>
              Vendas começarão em {{ moment(group?.sales_start_date).format('DD/MM/YYYY') }}
            </template>
          </p>
        </div>
        <div v-if="!group?.dependent_batch" class="mr-5">
          <span class="text-main-color font-bold px-2 py-1 text-[18px] bg-main-transparent rounded-full">
            {{ group?.tickets }}
          </span>
        </div>
        <div v-else class="mr-5">
          <span class="text-[12px] font-[600] text-main-color px-3 py-2 bg-main-transparent rounded-[5px]">
            Disponível em breve
          </span>
        </div>
      </div>
      <ul v-if="!group?.dependent_batch" class="text-txt-color">
        <li v-for="(batch, i) in getBatchsList" :key="batch?.hash" class="mb-6 pt-5 flex justify-between items-center border-[#E5E5E5]" :class="{'border-t': i !== 0}">
          <div class="ml-5" :class="{'line-through': !haveAvailableTickets(batch)}">
            <h5 class="text-[18px] font-bold text-input-color mb-2">{{ batch?.name }}</h5>
            <p class="text-[16px] font-[400] text-txt-color">{{ formatMoney(batch?.amount) }} + taxas</p>
            <small class="text-[14px] font-[400] text-main-color">em até {{ batch?.max_installments ?? 12 }}x de {{ formatMoney(getTicketInstallments(batch?.hash)) }}</small>
          </div>
          <div v-if="haveAvailableTickets(batch) || (!haveAvailableTickets(batch) && batch?.selected_tickets > 0)" class="flex items-center mr-5">
            <template v-if="!loadingReservation">
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
                  'text-gray-300': !haveAvailableTickets(batch) || !saleHasStarted(batch) || dependsOnAnotherBatch(batch),
                  'text-main-color': haveAvailableTickets(batch) && saleHasStarted(batch) && !dependsOnAnotherBatch(batch),
                  'hover:scale-110': haveAvailableTickets(batch) && saleHasStarted(batch) && !dependsOnAnotherBatch(batch),
                  'hover:cursor-pointer': haveAvailableTickets(batch) && saleHasStarted(batch) && !dependsOnAnotherBatch(batch)
                }"
                @click="preCheckout.addTicket(batch?.hash)"
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