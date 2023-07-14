import { useProductStore } from "~~/store/product";
import { useCheckoutStore } from "~~/store/checkout";
import { storeToRefs } from "pinia";
import { saleHasStarted, haveAvailableTickets, dependsOnAnotherBatch } from "@/utils/validateBatch";

export const usePreCheckoutStore = defineStore("preCheckout", {
  state: () => ({
    batchs_list: [],
    reservations: [],
    loadingReservation: false
  }),
  getters: {
    getBatchsList: (state) => state.batchs_list,
    getReservations: (state) => state.reservations,
    getLoadingReservation: (state) => state.loadingReservation,
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
    updateReservation(value) {
      const reservation = this.reservations.find(x => x.id === value.id);
      const index = this.reservations.indexOf(reservation);
      if(index !== -1) {
        this.reservations.splice(index, 1, value);
      }
    },
    removeReservation(value) {
      const reservation = this.reservations.find(x => x.id === value.id);
      const index = this.reservations.indexOf(reservation);
      if(index !== -1) {
        this.reservations.splice(index, 1);
      }
    },
    setLoadingReservation(value) {
      this.loadingReservation = value;
    },
    async addTicket(hash) {
      let batch = this.batchs_list.find(x => x.hash === hash); 
      if(haveAvailableTickets(batch) && saleHasStarted(batch) && !dependsOnAnotherBatch(batch)) {
        batch.selected_tickets += 1;
        const checkoutStore = useCheckoutStore();
        checkoutStore.addProductList(batch);
        if(this.reservations?.length && this.reservations.some(x => x.offer_id === batch.id)) {
          // Edita a reserva do lote existente com a nova quantidade de ingressos selecionados
          const res = await this.putReservation(batch);
          localStorage.setItem('reservations', JSON.stringify(this.reservations));
        } else {
          // Cria nova reserva do ingresso do lote selecionado
          await this.createReservation(batch.id);
          localStorage.setItem('reservations', JSON.stringify(this.reservations));
        }
      }
    },
    async subTicket(hash) {
      let batch = this.batchs_list.find(x => x.hash === hash);
      if(batch?.selected_tickets > 0 && saleHasStarted(batch)) {
        batch.selected_tickets -= 1;
        const checkoutStore = useCheckoutStore();
        checkoutStore.removeProductList(batch);
        if(batch.selected_tickets === 0) {
          // Deleta a reserva do lote existente, já que foram removidos todos ingressos
          const reservation = this.reservations.find(x => x.offer_id === batch.id);
          await this.deleteReservation(reservation);
          localStorage.setItem('reservations', JSON.stringify(this.reservations));
        } else {
          // Edita a reserva do lote existente com a nova quantidade de ingressos selecionados
          const res = await this.putReservation(batch);
          localStorage.setItem('reservations', JSON.stringify(this.reservations))
        }
      }
    },
    async createReservation(offer_id) {
      const start = new Date();
      const end = new Date(start.getTime());
      end.setMinutes(end.getMinutes() + 10);
      const payload = { start, end, offer_id, quantity: 1 };
      this.setLoadingReservation(true);
      try {
        const res = await useApi().create('/event/reservation', payload);
        this.addReservation({ ...res, offer_id });
        return res;
      } catch(err) {
        console.error(err);
        return err;
      } finally {
        this.setLoadingReservation(false);
      }
    },
    async putReservation(batch) {
      const reservation = this.reservations.find(x => x.offer_id === batch.id);
      const payload = { ...reservation, quantity: batch.selected_tickets };
      this.setLoadingReservation(true);
      try {
        const res = await useApi().update(`/event/reservation/${payload.token}`, payload);
        this.updateReservation({ ...res, offer_id: batch.id });
        return res;
      } catch(err) {
        console.error(err);
        return err;
      } finally {
        this.setLoadingReservation(false);
      }
    },
    async deleteReservation(reservation) {
      this.setLoadingReservation(true);
      try {
        const res = await useApi().remove(`/event/reservation/${reservation.token}`);
        if(this.reservations?.length) this.removeReservation(reservation);
        return res;
      } catch(err) {
        console.error(err)
        return err;
      } finally {
        this.setLoadingReservation(false);
      }
    }
  }
});
