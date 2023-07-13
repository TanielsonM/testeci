<script setup>
import { storeToRefs } from "pinia";
import { useCheckoutStore } from "~~/store/checkout";
import { usePreCheckoutStore } from "~~/store/preCheckout";
import { useCustomCheckoutStore } from "~~/store/customCheckout";
import { useExpiredSessionStore } from "~~/store/modal/expiredSession";
import { useAmountStore } from "~~/store/modules/amount";

const checkout = useCheckoutStore();
const preCheckout = usePreCheckoutStore();
const custom_checkout = useCustomCheckoutStore();
const expiredSession = useExpiredSessionStore();
const amountStore = useAmountStore();

const { amount } = storeToRefs(amountStore);
const { getReservations } = storeToRefs(preCheckout);
const route = useRoute();
await checkout.init();
const theme = custom_checkout.theme;

function byTickets() {
  expiredSession.setHaveFinished(false);
  navigateTo(`/${route.params?.product_id}`);
}

async function showUnloadAlert(evt) {
  console.log(getReservations?.value?.length)
  if(getReservations?.value?.length) {
    evt.preventDefault();
    evt.returnValue = '';
    return "Sua sessão ainda esta ativa, e você possui ingressos selecionados, caso recarregue a página esses dados serão perdidos.";
  }
}

onMounted(() => {
  window.addEventListener('beforeunload', showUnloadAlert);

  setTimeout(() => {
    if(localStorage.getItem('reservations')) {
      let reservations = JSON.parse(localStorage.getItem('reservations'));
      if(reservations?.length) {
        reservations.forEach(async reservation => {
          try {
            const res = await preCheckout.deleteReservation(reservation);
            reservations = reservations.filter(x => x.id !== reservation.id)
            localStorage.setItem('reservations', reservations)
            return res;
          } catch(err) {
            return err;
          }
        });
      }
    }
  }, 500)
})

onBeforeUnmount(() => {
  window.removeEventListener('beforeunload', showUnloadAlert);
});
</script>

<template>
  <NuxtLayout name="pre-checkout">

    <section class="flex w-full flex-col xl:max-w-[780px]" @click="teste">
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
          <h1 class="mb-[5px] text-[18px] font-[700] text-main-color">
            {{ formatMoney(amount) }}
          </h1>
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
