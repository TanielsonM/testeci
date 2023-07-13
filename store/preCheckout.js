import { useProductStore } from "~~/store/product";
import { useCheckoutStore } from "~~/store/checkout";
import { storeToRefs } from "pinia";
import { saleHasStarted, haveAvailableTickets, dependsOnAnotherBatch } from "@/utils/validateBatch";

export const usePreCheckoutStore = defineStore("preCheckout", {
  state: () => ({
    batchs_list: [],
    reservations: [],
  }),
  getters: {
    getBatchsList: (state) => state.batchs_list,
    getReservations: (state) => state.reservations,
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
    setReservations(value) {
      this.reservations = value;
    },
    addReservation(value) {
      this.reservations.push(value);
    },
    removeReservation(value) {
      const index = this.reservations.indexOf(value);
      if(index !== -1) {
        this.reservations = this.reservations.splice(index, 1);
      }
    },
    async addTicket(hash) {
      let batch = this.batchs_list.find(x => x.hash === hash); 
      if(haveAvailableTickets(batch) && saleHasStarted(batch) && !dependsOnAnotherBatch(batch)) {
        batch.selected_tickets += 1;
        const checkoutStore = useCheckoutStore();
        checkoutStore.addProductList(batch);
        console.log(this.reservations, this.reservations?.length && this.reservations.some(x => x.offer_id === batch.id))
        if(this.reservations?.length && this.reservations.some(x => x.offer_id === batch.id)) {
          // Edita a reserva do lote existente com a nova quantidade de ingressos selecionados
          const reservation = this.reservations.find(x => x.offer_id === batch.id)
          const payload = {
            ...reservation,
            quantity: batch.selected_tickets
          }
          console.log("update payload reservation", payload, reservation)
          await useApi()
            .update(`/event/reservation/${reservation.token}`, payload)
            .then(res => {
              console.log("create res", res)
              this.addReservation({...res, offer_id: batch.id})
              localStorage.setItem('reservations', JSON.stringify(this.reservations))
            })
            .catch(err => console.error(err))
        } else {
          // Cria nova reserva do ingresso do lote selecionado
          const start = new Date();
          const end = new Date(start.getTime());
          end.setMinutes(end.getMinutes() + 10);
          const payload = {
            start,
            end,
            offer_id: batch.id,
            quantity: 1
          }
          console.log("create payload", payload)
          await useApi()
            .create('/event/reservation', payload)
            .then(res => {
              console.log("create res", res)
              this.addReservation({...res, offer_id: batch.id})
              localStorage.setItem('reservations', JSON.stringify(this.reservations))
            })
            .catch(err => console.error(err))
        }
      }
    },
    async subTicket(hash) {
      let batch = this.batchs_list.find(x => x.hash === hash)
      if(batch?.selected_tickets > 0 && saleHasStarted(batch)) {
        batch.selected_tickets -= 1;
        const checkoutStore = useCheckoutStore();
        checkoutStore.removeProductList(batch);
        if(batch.selected_tickets === 0) {
          // Deleta a reserva do lote existente, já que foram removidos todos ingressos
          const reservation = this.reservations.find(x => x.offer_id === batch.id)
          console.log("delete reservation", reservation)
          await this.deleteReservation(reservation)
          localStorage.setItem('reservations', JSON.stringify(this.reservations));
        } else {
          // Edita a reserva do lote existente com a nova quantidade de ingressos selecionados
          const reservation = this.reservations.find(x => x.offer_id === batch.id)
          const payload = {
            ...reservation,
            quantity: batch.selected_tickets
          }
          console.log("update payload reservation", payload, reservation)
          await useApi()
            .update(`/event/reservation/${reservation.token}`, payload)
            .then(res => {
              console.log("create res", res)
              this.addReservation({...res, offer_id: batch.id})
              localStorage.setItem('reservations', JSON.stringify(this.reservations))
            })
            .catch(err => console.error(err))
        }
      }
    },
    async deleteReservation(reservation) {
      console.log("delete reservation", reservation)
      try {
        const res = await useApi().remove(`/event/reservation/${reservation.token}`)
        console.log("delete res", res)
        if(this.reservations?.length) this.removeReservation(reservation);
        return res;
      } catch(err) {
        console.error(err)
        return err;
      }
    }
  }
});
