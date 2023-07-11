import { useProductStore } from "~~/store/product";
import { useCheckoutStore } from "~~/store/checkout";
import { storeToRefs } from "pinia";
import { saleHasStarted } from "@/utils/validateBatch";

export const usePreCheckoutStore = defineStore("preCheckout", {
  state: () => ({
    batchs_list: []
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
    addTicket(id) {
      let batch = this.batchs_list.find(x => x.id === id);
      if(batch?.ticket_quantity !== batch?.selected_tickets && saleHasStarted(batch)) {
        batch.selected_tickets += 1;
        const checkoutStore = useCheckoutStore();
        checkoutStore.addProductList(batch);
      }
    },
    subTicket(id) {
      let batch = this.batchs_list.find(x => x.id === id)
      if(batch?.selected_tickets > 0 && saleHasStarted(batch)) {
        batch.selected_tickets -= 1;
        const checkoutStore = useCheckoutStore();
        checkoutStore.removeProductList(batch);
      }
    }
  }
});
