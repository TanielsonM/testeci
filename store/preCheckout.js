import { useProductStore } from "~~/store/product";
import { useCheckoutStore } from "~~/store/checkout";
import { storeToRefs } from "pinia";
import { saleHasStarted, haveAvailableTickets, dependsOnAnotherBatch } from "@/utils/validateBatch";

export const usePreCheckoutStore = defineStore("preCheckout", {
  state: () => ({
    batches: [],
    reservations: [],
    loadingReservation: false,
  }),
  getters: {
    getBatches: (state) => state.batches,
    getReservations: (state) => state.reservations,
    getLoadingReservation: (state) => state.loadingReservation,
    isPresentialEvent() {
      const { product } = useProductStore();
      return product.product_type_id === 3;
    },
    ticketList() {
      const checkoutStore = useCheckoutStore();
      const { product_list } = storeToRefs(checkoutStore);
      const batchesObj = {};

      if(!Array.isArray(product_list?.value)) return [];

      product_list.value.forEach(ticket => {
        const { id, name, batch_order, amount } = ticket;
        if (batchesObj[batch_order]) {
          // Atualiza o valor total_amount do grupo existente e a quantidade de ingressos
          batchesObj[batch_order].total_amount += amount;
          batchesObj[batch_order].tickets += 1;
        } else {
          // Cria um novo grupo com o valor total_amount e quantidade de ingressos inicializado
          let batch_name = '';
          this.batches.forEach(batch => {
            batch.tickets.forEach(x => {
              if(id === x.id) batch_name = batch.name;
            })
          })
          batchesObj[batch_order] = { id, name, total_amount: amount, tickets: 1, batch_name };
        }
      });

      // Converte o objeto 'batchesObj' em um array de objetos
      const batchesArry = Object.entries(batchesObj).map(([batch_order, { id, name, total_amount, tickets, batch_name }]) => ({
        batch_order: parseInt(batch_order),
        id,
        name,
        total_amount,
        tickets,
        batch_name
      }));

      batchesArry.sort((a, b) => a.batch_order - b.batch_order);
      return batchesArry;
    },
  },
  actions: {
    setBatches(value) {
      this.batches = value;
    },
    updateAvailableTickets(tickets) {
      if(Array.isArray(tickets)) {
        tickets.forEach(ticket => {
          let batch = this.batches.find(x => x.id === ticket.batch_id);
          batch.selectedt_batch_tickets = batch?.selectedt_batch_tickets ?? 0
        })
      }
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
    setLoadingReservation(value, ticket) {
      ticket.load = value;
    },
    someTotalTicket(array){
      let totalSelectedTickets = 0;
        array.forEach(item => {
          if (item.selected_tickets) {
            totalSelectedTickets += item.selected_tickets;
          }
        });
        return totalSelectedTickets;
    },
    async addTicket(batch_group, hash) {
      let batch = this.batches.find(x => x.id === batch_group.id);
      let ticket = batch.tickets.find(x => x.hash === hash);
      if(haveAvailableTickets(batch) && saleHasStarted(batch) && !dependsOnAnotherBatch(batch)) {
        ticket.selected_tickets += 1;
        batch.selectedt_batch_tickets = this.someTotalTicket(batch.tickets);
        const checkoutStore = useCheckoutStore();
        checkoutStore.setProductListPreCheckout(ticket);
        // if(this.reservations?.length && this.reservations.some(x => x.offer_id === ticket.id)) {
        //   // Edita a reserva do lote existente com a nova quantidade de ingressos selecionados
        //   const res = await this.putReservation(ticket);
        //   localStorage.setItem('reservations', JSON.stringify(this.reservations));
        // } else {
          // Cria nova reserva do ingresso do lote selecionado
          await this.createReservation(ticket.id, ticket);
          localStorage.setItem('reservations', JSON.stringify(this.reservations));
        // }
      }
    },
    async subTicket(batch_group, hash) {
      const batch = this.batches.find(x => x.id === batch_group.id);
      let ticket = batch.tickets.find(x => x.hash === hash);
      if(ticket?.selected_tickets > 0 && saleHasStarted(batch)) {
        ticket.selected_tickets -= 1;
        batch.selectedt_batch_tickets = this.someTotalTicket(batch.tickets);
        const checkoutStore = useCheckoutStore();
        const addProduct = false
        checkoutStore.setProductListPreCheckout(ticket, addProduct);
        // if(ticket.selected_tickets === 0) {
          // Deleta a reserva do lote existente, já que foram removidos todos ingressos
          const reservation = this.reservations.find(x => x.offer_id === ticket.id);
          await this.deleteReservation(reservation, ticket);
          localStorage.setItem('reservations', JSON.stringify(this.reservations));
        // } else {
        //   // Edita a reserva do lote existente com a nova quantidade de ingressos selecionados
        //   const res = await this.putReservation(ticket);
        //   localStorage.setItem('reservations', JSON.stringify(this.reservations))
        // }
      }
    },
    async createReservation(offer_id, ticket) {
      const start = new Date();
      const end = new Date(start.getTime());
      end.setMinutes(end.getMinutes() + 10);
      const payload = { start, end, offer_id, quantity: 1 };
      this.setLoadingReservation(true, ticket);
      try {
        const res = await useApi().create('/event/reservation', payload);
        this.addReservation({ ...res, offer_id });
        this.updateAvailableTickets(res.tickets);
        return res;
      } catch(err) {
        console.error(err);
        return err;
      } finally {
        this.setLoadingReservation(false, ticket);
      }
    },
    async putReservation(ticket) {
      const reservation = this.reservations.find(x => x.offer_id === ticket.id);
      const payload = { ...reservation, quantity: ticket.selected_tickets };
      this.setLoadingReservation(true, ticket);
      try {
        const res = await useApi().update(`/event/reservation/${payload.token}`, payload);
        this.updateReservation({ ...res, offer_id: ticket.id });
        this.updateAvailableTickets(res.tickets);
        return res;
      } catch(err) {
        console.error(err);
        return err;
      } finally {
        this.setLoadingReservation(false, ticket);
      }
    },
    async deleteReservation(reservation, ticket) {
      this.setLoadingReservation(true, ticket);
      try {
        const res = await useApi().remove(`/event/reservation/${reservation.token}`);
        if(this.reservations?.length) this.removeReservation(reservation);
        this.batches.forEach(batch => {
          if(batch.tickets.some(x => x.id === reservation.offer_id)) {
            this.updateAvailableTickets(res.tickets);
          }
        })
        return res;
      } catch(err) {
        console.error(err)
        return err;
      } finally {
        this.setLoadingReservation(false, ticket);
      }
    }
  }
});
