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
    
     return today.isSameOrAfter(saleStartDate)
  } else {
    return true
  }
}

const haveAvailableTickets = function (batch) {
  // if(!batch?.available_tickets && batch?.available_tickets !== 0) return true;
  // else return batch?.available_tickets > 0;
  if(batch.release_type === 'by_stock'){
    return !(batch.selected_batch_tickets >= batch?.available_tickets)
  }else{
    // Para eventos que estão configurados para liberar por data || esgotar lote
    return true;
  }
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

const showUnloadAlertCheckout = async function (evt) {
  // Pergunta pro usuário se realmente quer recarregar a pagina ( F5 || CTRL + SHFIT + R )
  let getReservationsLocal = JSON.parse(window.localStorage.getItem('reservations'));
  if(getReservationsLocal?.length) {
    evt.preventDefault();
    evt.returnValue = 'Sua sessão ainda esta ativa, e você possui ingressos selecionados, caso recarregue a página esses dados serão perdidos.';
  }
}

const showUnloadAlert = async function () {
  let getReservationsLocal = JSON.parse(window.localStorage.getItem('reservations'));
  if(getReservationsLocal?.length) {
    await goBackToPreCheckout();
  }
}

const goBackToPreCheckout = async function (validateDelete = false) {
  const preCheckout = usePreCheckoutStore();
  const { getBatches, getReservations } = storeToRefs(preCheckout);
  let batchs = getBatches.value;
  let reservations = getReservations.value;
  const amountStore = useAmountStore();
  const goBackToPrecheckout = useGoBackToPrecheckoutStore();

  batchs.forEach((batch) => {
    batch.selected_batch_tickets = 0;
    batch.tickets.forEach((ticket) => {
      ticket.selected_tickets = 0;
    });
  });

  const deletePromises = reservations.map(reservation => {
    return preCheckout.deleteReservation(reservation, batchs, false , validateDelete);
  });

  try {
    await Promise.all(deletePromises);
  } catch (error) {
    console.error('Ocorreu um erro ao deletar as reservas:', error);
  }
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

const showBeforeBackNavigation = async function () {
  // Pergunta pro usuário se realmente quer voltar a página
  var confirmacao = confirm('Sua sessão ainda esta ativa, e você possui ingressos selecionados, caso volte a página esses dados serão perdidos, deseja continuar?');
  if (!confirmacao) {
    history.forward();
  } else {
    await goBackToPreCheckout(true); 
  }
}

export {
  saleHasStarted,
  haveAvailableTickets,
  dependsOnAnotherBatch,
  showUnloadAlert,
  goBackToPreCheckout,
  showBeforeBackNavigation,
  showUnloadAlertCheckout,
}
