<script setup>
import { storeToRefs } from "pinia";
import { useCheckoutStore } from "~~/store/checkout";
import { usePreCheckoutStore } from "~~/store/preCheckout";
import { useExpiredSessionStore } from "~~/store/modal/expiredSession";
import { showUnloadAlert } from "@/utils/validateBatch";

const checkout = useCheckoutStore();
const expiredSession = useExpiredSessionStore();

const { product_list } = storeToRefs(checkout);
const route = useRoute();
await checkout.init();

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
    const { getBatches } = storeToRefs(preCheckout);
    const batchs = getBatches?.value;
    const route_batchs = JSON.parse(route.query.batchs);

    if(Array.isArray(batchs) && Array.isArray(route_batchs)) {
      const filter_batchs = batchs.filter(b => route_batchs.includes(b.hash));
      if(filter_batchs.length) preCheckout.setBatches(filter_batchs);
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
      <EventTimer class="hidden"/>
      <EventImage class="mb-5" />
      <EventTitle class="mb-5" />
      <div class="flex justify-between">
        <EventInfo />
        <EventCalendar />
      </div>
      <EventShare />
      <EventDescription />
      <EventLocation />
      <EventOrganizers />
    </section>

    <section class="flex w-full flex-col xl:max-w-[780px]">
      <BatchHeader />
      <div class="w-full mb-5">
        <BatchList />
        <div class="flex flex-col justify-between items-start mb-12 md:flex-row md:items-center">
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
