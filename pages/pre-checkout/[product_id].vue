<script setup>
import { storeToRefs } from "pinia";
import { useCheckoutStore } from "~~/store/checkout";
import { usePreCheckoutStore } from "~~/store/preCheckout";
import { useExpiredSessionStore } from "~~/store/modal/expiredSession";
import { showUnloadAlertCheckout } from "@/utils/validateBatch";
const nuxtApp = useNuxtApp();

const checkout = useCheckoutStore();
const preCheckout = usePreCheckoutStore();
const expiredSession = useExpiredSessionStore();
const checkoutStore = useCheckoutStore();

const productStore = useProductStore();
const { product } = storeToRefs(productStore);

const route = useRoute();
const { $moment } = useNuxtApp();

const hasReservations = preCheckout.$state
const { product_list } = storeToRefs(checkoutStore);

function byTickets() {
  expiredSession.setHaveFinished(false);
  const queryParams = new URLSearchParams(route.query).toString();
  navigateTo(`/${route.params?.product_id}${queryParams ? `?${queryParams}` : ''}`);
}

await checkout.init(false, true).then((batches) => {
  // por algum motivo o batches ta sumindo, código abaixo para persistir
  if (batches?.length) preCheckout.setBatches(batches);
  return batches;
});

onMounted(async () => {
  if (process.client) {
    window.addEventListener('beforeunload', showUnloadAlertCheckout);
    if (window.localStorage.getItem('reservations')) {
      try {
        let reservations = JSON.parse(window.localStorage.getItem('reservations'));
        if (reservations?.length) {
          const promises = reservations.map(async ({ batch_id }) => {
            if (batch_id) {
              await preCheckout.forceUpdateAvailableBatches(batch_id);
            }
          });
          await Promise.all(promises);
          setTimeout(async () => {
            const promises = reservations.map(async reservation => {
              try {
                await preCheckout.deleteReservation(reservation, null, true);
                reservations = reservations.filter(x => x.id != reservation.id);
              } catch (err) {
                console.error(err)
              }
            });
            await Promise.all(promises);
            preCheckout.setReservations([]);
            localStorage.setItem('reservations', []);
          }, 500);
        }
      } catch (e) {
        checkout.setError(e.message);
        throw e;
      }
    }
  }

  if (route?.query?.batchs) {
    const preCheckout = usePreCheckoutStore();
    const { getBatches } = storeToRefs(preCheckout);
    const batchs = getBatches?.value;
    const route_batchs = JSON.parse(route.query.batchs);

    if (Array.isArray(batchs) && Array.isArray(route_batchs)) {
      const filter_batchs = batchs.filter(b => route_batchs.includes(b.hash));
      if (filter_batchs.length) preCheckout.setBatches(filter_batchs);
    }
  }
})

onBeforeUnmount(() => {
  window.removeEventListener('beforeunload', showUnloadAlertCheckout);
});

const dateEvent = computed(() => {
  return formatEventStartDate(product.value?.start_date);
});

function formatEventStartDate(Date) {
    const startDate = $moment(Date); 
    const dayOfWeek = startDate.format('ddd'); 
    const dateFormatted = startDate.format('D MMM, YYYY'); 
    const startDateConcat = `${dayOfWeek}, ${dateFormatted}`; 
    return startDateConcat;
}

await checkout.init().then(() => {
  let ogTitle = "Greenn Tickets";
  if (product?.value?.name) {
    ogTitle = `${product?.value?.name} | ${dateEvent.value} | Greenn Tickets`;
  }

  let ogDescription = "A plataforma de pagamento simples";
  if (product?.value?.description) {
    ogDescription = product.value.description;
  }

  let currentUrlOg = ""
  if (!process.client) {
    currentUrlOg = `https://payfast.greenn.com.br/${route.fullPath}`
  } else {
    currentUrlOg = window.location.href;
  }
  let urlForOG = new URL(currentUrlOg);
  urlForOG.searchParams.forEach((value, key) => urlForOG.searchParams.delete(key));

  nuxtApp.runWithContext(() =>
    useSeoMeta({
      ogTitle: ogTitle,
      ogDescription: ogDescription,
      ogType: "website",
      ogUrl: urlForOG.href,
      ogImage: product?.value?.images[0]?.path || "https://paystatic.greenn.com.br/og-image_greenn.png",
      ogImageHeight: "500",
      ogImageWidth: "500",
      ogSiteName: "Greenn - A plataforma de pagamentos simples",
    })
  );
});

</script>

<template>
  <NuxtLayout name="pre-checkout">

    <section class="flex w-full flex-col xl:max-w-[780px]" @click="teste">
      <EventTimer class="hidden" />
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
          <div class="w-full md:w-fit" :key="hasReservations">
            <BaseButton color="primary" :disabled="!product_list.length" @click="byTickets">
              {{ $t("pre_checkout.buy") }}
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
