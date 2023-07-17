import moment from "moment";
import { storeToRefs } from "pinia";
import { usePreCheckoutStore } from "~~/store/preCheckout";
import { useCheckoutStore } from "~~/store/checkout";

const saleHasStarted = function (batch) {
  const today = moment().format('DD/MM/YYYY');
  const saleStartDate = moment(batch?.sales_start_date).format('DD/MM/YYYY');
  return batch?.immediate_sale || (!batch?.immediate_sale && today === saleStartDate)
}

const haveAvailableTickets = function (batch) {
  if(!batch?.have_ticket_quantity) return true;
  else return batch?.tickets > 0;
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
  if(getReservations?.value?.length) {
    evt.preventDefault();
    evt.returnValue = '';
    return "Sua sessão ainda esta ativa, e você possui ingressos selecionados, caso recarregue a página esses dados serão perdidos.";
  }
}

const getLessMethods = function () {
  const checkout = useCheckoutStore();
  const preCheckout = usePreCheckoutStore();
  const { getBatchsList } = storeToRefs(preCheckout);
  let batchWithLessMethods = getBatchsList?.value[0];
  for (let i = 1; i < getBatchsList?.value?.length; i++) {
    const obj = getBatchsList?.value[i];
    const qtdCurrentMethods = obj?.method.split(',').length;
    const qtdLessMethods = batchWithLessMethods?.method.split(',').length;

    if (qtdCurrentMethods < qtdLessMethods) {
      batchWithLessMethods = obj;
    }
  }
  checkout.setMethod(batchWithLessMethods?.method.split(',')[0])
  return batchWithLessMethods?.method.split(',');
}

const goBackToPreCheckout = function() {
  const preCheckout = usePreCheckoutStore();
  const { getBatchsList } = storeToRefs(preCheckout);
  let batchs = getBatchsList.value;
  batchs.forEach(x => {
    x.selected_tickets = 0;
  });
  preCheckout.setBatchsList(batchs);
  const route = useRoute();
  navigateTo(`/pre-checkout/${route.params?.product_id}`);
}

export {
  saleHasStarted,
  haveAvailableTickets,
  dependsOnAnotherBatch,
  showUnloadAlert,
  getLessMethods,
  goBackToPreCheckout
}
