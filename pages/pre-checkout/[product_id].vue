<script setup>
import { useCheckoutStore } from "~~/store/checkout";
import { useCustomCheckoutStore } from "~~/store/customCheckout";
import { useExpiredSessionStore } from "~~/store/modal/expiredSession";

const checkout = useCheckoutStore();
const custom_checkout = useCustomCheckoutStore();
const expiredSession = useExpiredSessionStore();

const route = useRoute();
await checkout.init();
const theme = custom_checkout.theme;

function byTickets() {
  expiredSession.setHaveFinished(false);
  navigateTo(`/${route.params?.product_id}`);
}

</script>

<template>
  <NuxtLayout name="pre-checkout">

    <section class="flex w-full flex-col xl:max-w-[780px]">
      <BaseCard class="w-full p-5 mb-5 ">
        <h1 class="mb-[5px] text-[18px] font-[700] text-input-color">Pré-checkout</h1>
        <EventTimer class="hidden"/>
        <EventImage />
        <EventTitle />
        <EventDescription />
        <EventInfo />
        <div class="flex justify-between px-0 md:px-4 lg:px-8 font-bold text-input-color">
          <EventNeedHelp />
          <EventShare />
        </div>
      </BaseCard>
    </section>

    <section class="flex w-full flex-col xl:max-w-[780px]">
      <BaseCard class="w-full p-5 mb-5">
        <div class="flex justify-between mb-5">
          <h1 class="mb-[5px] text-[18px] font-[700] text-input-color">Ingressos</h1>
          <h1 class="mb-[5px] text-[18px] font-[700] text-main-color">R$ 0,00</h1>
        </div>
        <BatchList />
        <hr>
        <div class="flex flex-col justify-between items-center md:flex-row">
          <BatchTotal />
          <div class="w-full md:w-fit">
            <BaseButton
              :color="theme"
              @click="byTickets"
            >
              Comprar ingressos
            </BaseButton>
          </div>
        </div>
        <BatchInfoFees />
      </BaseCard>
    </section>

    <EventExpiredSessionModal />

  </NuxtLayout>
</template>
