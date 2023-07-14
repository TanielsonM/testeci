import moment from "moment";
import { storeToRefs } from "pinia";
import { usePreCheckoutStore } from "~~/store/preCheckout";

const saleHasStarted = function (batch) {
  const today = moment().format('DD/MM/YYYY');
  const saleStartDate = moment(batch?.sales_start_date).format('DD/MM/YYYY');
  return batch?.immediate_sale || (!batch?.immediate_sale && today === saleStartDate)
}

const haveAvailableTickets = function (batch) {
  if(!batch?.have_ticket_quantity) return true;
  else return batch?.selected_tickets < batch?.tickets;
}

const dependsOnAnotherBatch = function (batch) {
  if(!batch?.product_has_offer_id) return false;
  else {
    const preCheckout = usePreCheckoutStore();
    const { getBatchsList } = storeToRefs(preCheckout);
    if(getBatchsList?.value && Array.isArray(getBatchsList.value)) {
      const dependentBatch = getBatchsList.value.find(x => x.id === batch.product_has_offer_id);
      return haveAvailableTickets(dependentBatch);
    } else return false
  }
}

const showUnloadAlert = async function (evt) {
  const preCheckout = usePreCheckoutStore();
  const { getReservations } = storeToRefs(preCheckout);
  console.log(getReservations?.value?.length)
  if(getReservations?.value?.length) {
    evt.preventDefault();
    evt.returnValue = '';
    return "Sua sessão ainda esta ativa, e você possui ingressos selecionados, caso recarregue a página esses dados serão perdidos.";
  }
}

export {
  saleHasStarted,
  haveAvailableTickets,
  dependsOnAnotherBatch,
  showUnloadAlert
}
