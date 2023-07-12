import { useProductStore } from "~~/store/product";
import { useCheckoutStore } from "~~/store/checkout";
import { storeToRefs } from "pinia";
import { saleHasStarted, haveAvailableTickets, dependsOnAnotherBatch } from "@/utils/validateBatch";

export const usePreCheckoutStore = defineStore("preCheckout", {
  state: () => ({
    batchs_list: [
    // {
    //   product_id: 25733,
    //   hash: 'UpKGOT1',
    //   amount: 50,
    //   method: 'CREDIT_CARD,BOLETO,PIX',
    //   name: 'Teste Evento Presencial 8',
    //   allowed_coupon: 0,
    //   fixed_installments: null,
    //   max_boleto_installments: null,
    //   no_interest_installments: null,
    //   max_installments: null,
    //   period: 30,
    //   trial: null,
    //   charges: null,
    //   default: 1,
    //   reason: '',
    //   analised: 0,
    //   created_at: '2023-07-11T20:56:00.000000Z',
    //   updated_at: '2023-07-11T20:56:00.000000Z',
    //   max_subscription_installments: null,
    //   deleted_at: null,
    //   pre_selected_installment: null,
    //   currency_id: 1,
    //   allow_offer_link: 0,
    //   product_has_offer_id: null,
    //   have_ticket_quantity: 1,
    //   ticket_quantity: 100,
    //   batch_order: 1,
    //   are_non_transferable: 0,
    //   immediate_sale: 1,
    //   sales_start_date: '2023-07-14',
    //   has_sale_deadline: 1,
    //   sale_deadline: '2023-07-28',
    //   status_offer: 'APPROVED',
    //   custom_charges: [],
    //   selected_tickets: 0
    // },
    // {
    //   product_id: 25733,
    //   hash: 'UpKGOT2',
    //   amount: 50,
    //   method: 'CREDIT_CARD,BOLETO,PIX',
    //   name: 'Teste Evento Presencial 8 lote 2',
    //   allowed_coupon: 0,
    //   fixed_installments: null,
    //   max_boleto_installments: null,
    //   no_interest_installments: null,
    //   max_installments: null,
    //   period: 30,
    //   trial: null,
    //   charges: null,
    //   default: 1,
    //   reason: '',
    //   analised: 0,
    //   created_at: '2023-07-11T20:56:00.000000Z',
    //   updated_at: '2023-07-11T20:56:00.000000Z',
    //   max_subscription_installments: null,
    //   deleted_at: null,
    //   pre_selected_installment: null,
    //   currency_id: 1,
    //   allow_offer_link: 0,
    //   product_has_offer_id: null,
    //   have_ticket_quantity: 1,
    //   ticket_quantity: 100,
    //   batch_order: 1,
    //   are_non_transferable: 0,
    //   immediate_sale: 1,
    //   sales_start_date: '2023-07-14',
    //   has_sale_deadline: 1,
    //   sale_deadline: '2023-07-28',
    //   status_offer: 'APPROVED',
    //   custom_charges: [],
    //   selected_tickets: 0
    // },
    // {
    //   product_id: 25733,
    //   hash: 'UpKGOT3',
    //   amount: 50,
    //   method: 'CREDIT_CARD,BOLETO,PIX',
    //   name: 'Teste Evento Presencial 8 lote 3',
    //   allowed_coupon: 0,
    //   fixed_installments: null,
    //   max_boleto_installments: null,
    //   no_interest_installments: null,
    //   max_installments: null,
    //   period: 30,
    //   trial: null,
    //   charges: null,
    //   default: 1,
    //   reason: '',
    //   analised: 0,
    //   created_at: '2023-07-11T20:56:00.000000Z',
    //   updated_at: '2023-07-11T20:56:00.000000Z',
    //   max_subscription_installments: null,
    //   deleted_at: null,
    //   pre_selected_installment: null,
    //   currency_id: 1,
    //   allow_offer_link: 0,
    //   product_has_offer_id: null,
    //   have_ticket_quantity: 1,
    //   ticket_quantity: 100,
    //   batch_order: 1,
    //   are_non_transferable: 0,
    //   immediate_sale: 1,
    //   sales_start_date: '2023-07-14',
    //   has_sale_deadline: 1,
    //   sale_deadline: '2023-07-28',
    //   status_offer: 'APPROVED',
    //   custom_charges: [],
    //   selected_tickets: 0
    // }
  ]
  }),
  getters: {
    getBatchsList: (state) => state.batchs_list,
    isPresentialEvent() {
      const { product } = useProductStore();
      return product.format === 'PRESENTIAL_EVENT';
    },
    ticketList() {
      const checkoutStore = useCheckoutStore();
      const { product_list } = storeToRefs(checkoutStore);

      const batchGroupsObj = {};
      if(!Array.isArray(product_list)) return 
      product_list.forEach(ticket => {
        const { batch_order, id, amount } = ticket;
        if (batchGroupsObj[batch_order]) {
          batchGroupsObj[batch_order].total_amount += amount;
        } else {
          batchGroupsObj[batch_order] = { id, total_amount: amount };
        }
      });

      // Converte o objeto 'batchGroups' em um array de objetos
      const batchGroupsArry = Object.entries(batchGroupsObj).map(([batch_order, { id, total_amount }]) => ({
        batch_order: parseInt(batch_order),
        id,
        total_amount
      }));

      batchGroupsArry.sort((a, b) => a.batch_order - b.batch_order);
      return batchGroupsArry;
    },
  },
  actions: {
    setBatchsList(value) {
      this.batchs_list = value;
    },
    addTicket(hash) {
      let batch = this.batchs_list.find(x => x.hash === hash); 
      if(haveAvailableTickets(batch) && saleHasStarted(batch) && !dependsOnAnotherBatch(batch)) {
        batch.selected_tickets += 1;
        const checkoutStore = useCheckoutStore();
        checkoutStore.addProductList(batch);
      }
    },
    subTicket(hash) {
      let batch = this.batchs_list.find(x => x.hash === hash)
      if(batch?.selected_tickets > 0 && saleHasStarted(batch)) {
        batch.selected_tickets -= 1;
        const checkoutStore = useCheckoutStore();
        checkoutStore.removeProductList(batch);
      }
    }
  }
});
