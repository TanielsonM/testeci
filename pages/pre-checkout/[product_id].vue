<script setup>
import { storeToRefs } from "pinia";
import { useCheckoutStore } from "~~/store/checkout";
import { usePreCheckoutStore } from "~~/store/preCheckout";
import { useCustomCheckoutStore } from "~~/store/customCheckout";
import { useExpiredSessionStore } from "~~/store/modal/expiredSession";
import { useAmountStore } from "~~/store/modules/amount";
import { showUnloadAlert } from "@/utils/validateBatch";

const checkout = useCheckoutStore();
const custom_checkout = useCustomCheckoutStore();
const expiredSession = useExpiredSessionStore();
const amountStore = useAmountStore();

const { amount } = storeToRefs(amountStore);
const { product_list } = storeToRefs(checkout);
const route = useRoute();
await checkout.init();
const theme = custom_checkout.theme;

function byTickets() {
  expiredSession.setHaveFinished(false);
  navigateTo(`/${route.params?.product_id}`);
}

onMounted(() => {
  window.addEventListener('beforeunload', showUnloadAlert);

  setTimeout(async () => {
    if(localStorage.getItem('reservations')) {
      try {
        let reservations = JSON.parse(localStorage.getItem('reservations'));
        if(reservations?.length) {
          const preCheckout = usePreCheckoutStore();
          const promises = reservations.map(async reservation => {
            try {
              await preCheckout.deleteReservation(reservation);
              reservations = reservations.filter(x => x.id !== reservation.id);
            } catch(err) {
              consol.error(err)
            }
          });
          await Promise.all(promises);
          preCheckout.setReservations(reservations);
          localStorage.setItem('reservations', reservations);
        }
        return reservations;
      } catch (error) {
        return error;
      }
    }
  }, 500)

  if(route?.query?.batchs) {
    const preCheckout = usePreCheckoutStore();
    const { getBatchsList } = storeToRefs(preCheckout);
    const batchs = getBatchsList?.value;
    const route_batchs = JSON.parse(route.query.batchs);

    if(Array.isArray(batchs) && Array.isArray(route_batchs)) {
      const filter_batchs = batchs.filter(b => route_batchs.includes(b.hash));
      if(filter_batchs.length) preCheckout.setBatchsList(filter_batchs);
    }
  }
})

onBeforeUnmount(() => {
  window.removeEventListener('beforeunload', showUnloadAlert);
});
</script>

<template>
  <NuxtLayout name="pre-checkout">

    <section class="flex w-full flex-col xl:max-w-[780px]" @click="teste">
      <BaseCard class="w-full p-5 mb-5 ">
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
      <div class="flex justify-between items-center mb-5">
        <div class="flex items-center px-3 bg-[#F7F7F7] rounded-lg">
          <img
            class="mr-2"
            src="@/assets/icons/credit_card.svg"
            alt="credit_card_icon"
          />
          <h4 class="mb-[5px] mt-1 text-[14px] font-[600] text-input-color">
            Parcele sua compra em até 12x
          </h4>
        </div>
        <div class="px-3 pt-1 bg-main-transparent rounded-lg">
          <h4 class="mb-[5px] text-[18px] font-[700] text-main-color">
            {{ formatMoney(amount) }}
          </h4>
        </div>
      </div>
      <div class="w-full mb-5">
        <BatchList />
        <div class="flex flex-col justify-between items-center mb-12 md:flex-row">
          <BatchTotal />
          <div class="w-full md:w-fit">
            <BaseButton
              color="primary"
              :disabled="!product_list?.length"
              @click="byTickets"
            >
              Comprar ingressos
            </BaseButton>
          </div>
        </div>
        <BatchPaymentMethods />
        <!-- <BatchInfoFees /> -->
      </div>
    </section>

    <EventExpiredSessionModal />

  </NuxtLayout>
</template>
