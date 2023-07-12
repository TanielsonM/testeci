import moment from "moment";
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
    const dependentBatch = getBatchsList.find(x => x.id === batch.product_has_offer_id);
    return haveAvailableTickets(dependentBatch);
  }
}

export {
  saleHasStarted,
  haveAvailableTickets,
  dependsOnAnotherBatch
}
