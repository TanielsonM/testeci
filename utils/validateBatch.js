import moment from "moment";

export function saleHasStarted(batch) {
  const today = moment().format('DD/MM/YYYY');
  const saleStartDate = moment(batch?.sales_start_date).format('DD/MM/YYYY');
  return batch?.immediate_sale || (!batch?.immediate_sale && today === saleStartDate)
}

export function haveAvailableTickets(batch) {
  if(!batch?.have_ticket_quantity) return true;
  else return batch?.selected_tickets < batch?.tickets;
}
