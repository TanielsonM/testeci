<script setup>
// import { useProductStore } from "~~/store/product";
// const { product } = useProductStore();
import { storeToRefs } from "pinia";
import { usePreCheckoutStore } from "~~/store/preCheckout";
import { useInstallmentsStore } from "~~/store/modules/installments";

const preCheckout = usePreCheckoutStore();
const installments = useInstallmentsStore();
const { getBatchsList } = storeToRefs(preCheckout);
const { getTicketInstallments } = storeToRefs(installments);
</script>

<template>
  <div class="mb-3">
    <ul class="text-txt-color">
      <li v-for="batch in getBatchsList" :key="batch.id" class="mb-6 flex justify-between items-center">
        <div :class="{'line-through': batch?.ticket_quantity === batch?.selected_tickets }">
          <h5 class="text-base font-semibold text-input-color mb-2">{{ batch?.name }}</h5>
          <p class="text-sm">{{ formatMoney(batch?.amount) }} (+ {{ formatMoney(batch?.amount * batch?.fee) }} de taxa)</p>
          <small class="text-main-color">em até {{ batch?.max_installments }}x de {{ formatMoney(getTicketInstallments()) }}</small>
          <p class="text-sm font-normal text-gray-400">Vendas até 08/07/2023</p>
        </div>
        <div v-if="true" class="flex items-center">
          <Icon
            name="mdi:minus-circle-outline"
            size="20"
            :class="{
              'text-gray-300': batch.selected_tickets === 0,
              'text-main-color': batch.selected_tickets > 0,
              'hover:scale-110': batch.selected_tickets > 0,
              'hover:cursor-pointer': batch.selected_tickets > 0
            }"
            @click="preCheckout.subTicket(batch.id)"
          />
          <span class="mx-2 font-semibold">{{ batch.selected_tickets }}</span>
          <Icon
            name="mdi:plus-circle-outline"
            size="20"
            :class="{
              'text-gray-300': batch.ticket_quantity === batch.selected_tickets,
              'text-main-color': batch.ticket_quantity !== batch.selected_tickets,
              'hover:scale-110': batch.ticket_quantity !== batch.selected_tickets,
              'hover:cursor-pointer': batch.ticket_quantity !== batch.selected_tickets
            }"
            @click="preCheckout.addTicket(batch.id)"
          />
        </div>
        <div v-else>
          <span class="mx-2 font-normal text-gray-400">Esgotado</span>
        </div>
      </li>
      <li class="mb-6 flex justify-between items-center">
        <div :class="{'line-through': true}">
          <h5 class="text-base font-semibold text-input-color mb-2">Primeiro Lote</h5>
          <p class="text-sm">R$ 610,00 (+ R$ 61,00 taxa)</p>
          <small class="text-main-color">em até 12x de R$ 69,40</small>
          <p class="text-sm font-normal text-gray-400">Vendas até 08/07/2023</p>
        </div>
        <div v-if="false" class="flex items-center">
          <Icon
            name="mdi:minus-circle-outline"
            size="20"
            :class="{
              'text-gray-300': false,
              'text-main-color': true,
              'hover:scale-110': true,
              'hover:cursor-pointer': true
            }"
          />
          <span class="mx-2 font-semibold">1</span>
          <Icon name="mdi:plus-circle-outline" size="20" class="text-main-color hover:scale-110 hover:cursor-pointer" />
        </div>
        <div v-else>
          <span class="mx-2 font-normal text-gray-400">Esgotado</span>
        </div>
      </li>
    </ul>
  </div>
</template>