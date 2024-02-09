import moment from "moment";
import { storeToRefs } from "pinia";
import { usePreCheckoutStore } from "~~/store/preCheckout";
import { useCheckoutStore } from "~~/store/checkout";
import { useAmountStore } from "~~/store/modules/amount";
import { useGoBackToPrecheckoutStore } from "~~/store/modal/goBackToPrecheckout";

const saleHasStarted = function (batch) {
  if(batch.release_type && batch.release_type === 'fixed_date') {
    const today = moment();
    const saleStartDate = moment(batch?.release_fixed_date);
    return today >= saleStartDate
  } else {
    return true
  }
}

const haveAvailableTickets = function (batch) {
  if(!batch?.available_tickets && batch?.available_tickets !== 0) return true;
  else return batch?.available_tickets > 0;
}

const dependsOnAnotherBatch = function (batch) {
  if(batch.release_type && batch.release_type === 'offer_group_stock' && batch?.release_offer_group_stock_id) {
    const preCheckout = usePreCheckoutStore();
    const { getBatches } = storeToRefs(preCheckout);
    if(getBatches?.value && Array.isArray(getBatches.value)) {
      const dependentBatch = getBatches.value.find(x => x.id === batch?.release_offer_group_stock_id);
      return haveAvailableTickets(dependentBatch);
    } else return false
  } else {
    return false
  }
}

const showUnloadAlert = async function (evt) {
  const preCheckout = usePreCheckoutStore();
  const { getReservations } = storeToRefs(preCheckout);
  if(getReservations?.value?.length) {
    evt.preventDefault();
    evt.returnValue = '';
    return "Sua sessão ainda esta ativa, e você possui ingressos selecionados, caso recarregue a página esses dados serão perdidos.";
  }
}

const goBackToPreCheckout = function() {
  const preCheckout = usePreCheckoutStore();
  const { getBatches, getReservations } = storeToRefs(preCheckout);
  let batchs = getBatches.value;
  let reservations = getReservations.value;
  const amountStore = useAmountStore();
  const goBackToPrecheckout = useGoBackToPrecheckoutStore();

  batchs.forEach((batch) => {
    batch.selectedt_batch_tickets = 0;
    batch.tickets.forEach((ticket) => {
      ticket.selected_tickets = 0;
    });
  });

  reservations.forEach((reservation) => {
    preCheckout.deleteReservation(reservation, batchs);
  });
  amountStore.reset();
  preCheckout.setBatches(batchs);
  const checkout = useCheckoutStore();
  checkout.setCoupon(false, true);
  checkout.resetProducts();
  goBackToPrecheckout.setShowModal(false);
  const route = useRoute();
  const queryParams = new URLSearchParams(route.query).toString();
  navigateTo(`/pre-checkout/${route.params?.product_id}${queryParams ? `?${queryParams}` : ''}`);
}

export {
  saleHasStarted,
  haveAvailableTickets,
  dependsOnAnotherBatch,
  showUnloadAlert,
  goBackToPreCheckout
}
