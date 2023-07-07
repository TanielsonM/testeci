<script setup>
import { useCheckoutStore } from "~~/store/checkout";
import { useCustomCheckoutStore } from "~~/store/customCheckout";

const checkout = useCheckoutStore();
const custom_checkout = useCustomCheckoutStore();

await checkout.init();
const theme = custom_checkout.theme;

</script>

<template>
  <NuxtLayout name="pre-checkout">
  
    <section class="flex w-full flex-col xl:max-w-[780px]">
      <BaseCard class="w-full p-5 mb-5 ">
        <h1 class="mb-[5px] text-[18px] font-[700] text-input-color">Pré-checkout</h1>
        <img class="rounded" src="https://heavenclub.com.br/wp-content/uploads/2022/08/03-SET-Heaven-in-rio-POST-Capa-Evento-1280x720-1.jpg" alt="event_img">
        <h5 class="text-base font-semibold text-input-color">Rock in Rio - 2022 | HEAVED</h5>
        <p class="text-justify text-sm font-normal leading-relaxed text-gray-500 mb-3">
          Venha se juntar a nós em uma noite eletrizante de música no evento
          Rock in Rio 2022 | HEAVED! No sábado, dia 03 de setembro de 2022,
          prepare-se para uma experiência inesquecível às 23h no Club Three,
          localizado na rua Riachelo, 97, Centro, Rio de Janeiro.
          Com um line-up incrível de artistas renomados, o evento promete levar
          o público a um mundo de emoções e energia contagiante. Não perca a 
          portunidade de vivenciar momentos únicos ao som do melhor rock da atualidade.
          Garanta o seu ingresso agora e prepare-se para uma noite épica no
          Rock in Rio 2022 | HEAVED!
        </p>
        <ul class="mb-6 text-txt-color">
          <li class="flex items-center mb-2">
            <div class="min-w-[15px] h-[15px] bg-main-color mr-3"></div>
            <span>Data do evento: 03/09/2022</span>
          </li>
          <li class="flex items-center mb-2">
            <div class="min-w-[15px] h-[15px] bg-main-color mr-3"></div>
            <span>Início: 23:00 (horário de Brasília)</span>
          </li>
          <li class="flex items-center mb-2">
            <div class="min-w-[15px] h-[15px] bg-main-color mr-3"></div>
            <span>Local: Rua Riachuelo, 97 - Centro - Rio de Janeiro/RJ</span>
          </li>
        </ul>
        <div class="flex justify-between px-0 md:px-4 lg:px-8 font-bold text-input-color">
          <div class="flex items-center hover:text-main-color cursor-pointer">
            <Icon name="mdi:help-circle-outline" class="mr-1" size="20" />
            <h4 class="mr-2">Preciso de ajuda</h4>
          </div>
          <div class="flex items-center hover:text-main-color cursor-pointer">
            <Icon name="mdi:reply" class="scale-x-[-1] mr-1" size="20" />
            <h4>Compartilhar</h4>
          </div>
        </div>
      </BaseCard>
    </section>
    <section class="flex w-full flex-col xl:max-w-[780px]">
      <BaseCard class="w-full p-5 mb-5">
        <div class="flex justify-between mb-5">
          <h1 class="mb-[5px] text-[18px] font-[700] text-input-color">Ingressos</h1>
          <h1 class="mb-[5px] text-[18px] font-[700] text-main-color">R$ 0,00</h1>
        </div>
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
        <hr>
        <div class="flex flex-col justify-between items-center md:flex-row">
          <div>
            <small class="text-gray-400">Total</small>
            <p class="text-3xl text-input-color font-bold">R$ 671,00</p>
            <small class="text-main-color">ou 12x de R$ 69,40</small>
          </div>
          <div class="w-full md:w-fit">
            <BaseButton :class="{'bg-black': theme === 'light', 'bg-white': theme === 'dark'}">
              <span :class="{'text-white': theme === 'light', 'text-black': theme === 'dark'}">
                Comprar ingressos
              </span>
            </BaseButton>
          </div>
        </div>
        <div class="flex justify-end">
          <small class="text-gray-400 hover:text-txt-color hover:cursor-pointer">Entenda as taxas</small>
        </div>
      </BaseCard>
    </section>
  </NuxtLayout>
</template>

<style>

</style>