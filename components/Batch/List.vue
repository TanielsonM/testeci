<script setup>
// import { useProductStore } from "~~/store/product";
// const { product } = useProductStore();
import { useInstallmentsStore } from "~~/store/modules/installments";
const installments = useInstallmentsStore();
const { getInstallments } = storeToRefs(installments);

const batchs = ref([
  {
    id: 1,
    name: 'Primeiro Lote',
    amount: 610,
    fee: 0.1,
    max_installments: 12,
  },
  {
    id: 2,
    name: 'Segundo Lote',
    amount: 610,
    fee: 0.1,
    max_installments: 12,
  },
  {
    id: 3,
    name: 'Terceiro Lote',
    amount: 610,
    fee: 0.1,
    max_installments: 12,
  }
]);
</script>

<template>
  <div class="mb-3">
    <ul class="text-txt-color">
      <li v-for="batch in batchs" :key="batch.id" class="mb-6 flex justify-between items-center">
        <div>
          <h5 class="text-base font-semibold text-input-color mb-2">{{ batch.name }}</h5>
          <p class="text-sm">{{ formatMoney(batch.amount) }} (+ {{ formatMoney(batch.amount * batch.fee) }} de taxa)</p>
          <small class="text-main-color">em até {{ batch.max_installments }}x de {{ formatMoney(getInstallments(batch.max_installments)) }}</small>
          <p class="text-sm font-normal text-gray-400">Vendas até 08/07/2023</p>
        </div>
        <div v-if="true" class="flex items-center">
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
      <li class="mb-6 flex justify-between items-center">
        <div>
          <h5 class="text-base font-semibold text-input-color mb-2">Primeiro Lote</h5>
          <p class="text-sm">R$ 610,00 (+ R$ 61,00 taxa)</p>
          <small class="text-main-color">em até 12x de R$ 69,40</small>
          <p class="text-sm font-normal text-gray-400">Vendas até 08/07/2023</p>
        </div>
        <div v-if="true" class="flex items-center">
          <Icon
            name="mdi:minus-circle-outline"
            size="20"
            :class="{
              'text-gray-300': true,
              'text-main-color': false,
              'hover:scale-110': false,
              'hover:cursor-pointer': false
            }"
          />
          <span class="mx-2 font-semibold">0</span>
          <Icon name="mdi:plus-circle-outline" size="20" class="text-main-color hover:scale-110 hover:cursor-pointer" />
        </div>
        <div v-else>
          <span class="mx-2 font-normal text-gray-400">Esgotado</span>
        </div>
      </li>
      <li class="mb-6 flex justify-between items-center">
        <div class="line-through">
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