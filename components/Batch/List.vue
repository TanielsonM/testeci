<template>
  <div class="mb-3">
    <ul class="text-txt-color">
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