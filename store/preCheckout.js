import { useProductStore } from "~~/store/product";
import { useCheckoutStore } from "~~/store/checkout";

export const usePreCheckoutStore = defineStore("preCheckout", {
  state: () => ({
    batchs_list: [
      {
        id: 1,
        name: 'Primeiro Lote',
        amount: 610,
        fee: 0.1,
        max_installments: 12,
        have_ticket_quantity: true,
        ticket_quantity: 10,
        selected_tickets: 0
      },
      {
        id: 2,
        name: 'Segundo Lote',
        amount: 610,
        fee: 0.1,
        max_installments: 12,
        have_ticket_quantity: true,
        ticket_quantity: 10,
        selected_tickets: 0
      },
      {
        id: 3,
        name: 'Terceiro Lote',
        amount: 610,
        fee: 0.1,
        max_installments: 12,
        have_ticket_quantity: false,
        ticket_quantity: null,
        selected_tickets: 0
      }
    ]
  }),
  getters: {
    getBatchsList: (state) => state.batchs_list,
    isPresentialEvent() {
      const { product } = useProductStore();
      return product.format === 'PRESENTIAL_EVENT';
    }
  },
  actions: {
    setBatchsList(value) {
      this.batchs_list = value;
    },
    addTicket(id) {
      let batch = this.batchs_list.find(x => x.id === id);
      if(batch.ticket_quantity !== batch.selected_tickets) {
        batch.selected_tickets += 1;
        const checkoutStore = useCheckoutStore();
        checkoutStore.addProductList(batch);
      }
    },
    subTicket(id) {
      let batch = this.batchs_list.find(x => x.id === id)
      if(batch.selected_tickets > 0) {
        batch.selected_tickets -= 1;
        const checkoutStore = useCheckoutStore();
        checkoutStore.removeProductList(batch);
      }
    }
  }
});
