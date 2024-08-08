import { useProductStore } from "~~/store/product";
import { useCheckoutStore } from "~~/store/checkout";
import { storeToRefs } from "pinia";
import { saleHasStarted, haveAvailableTickets, dependsOnAnotherBatch } from "@/utils/validateBatch";
import * as Toast from "vue-toastification";

export const usePreCheckoutStore = defineStore("preCheckout", {
  state: () => ({
    batches: [],
    reservations: [],
    loadingReservation: false,
    hasAvailableTickets: true,
    soldOffTickets: false
  }),
  getters: {
    getBatches: (state) => state.batches,
    getReservations: (state) => state.reservations,
    getLoadingReservation: (state) => state.loadingReservation,
    isPresentialEvent(state) {
      const { product } = useProductStore();
      return product?.product_type_id == 3 && !!this.batches?.length;
    },
    ticketList() {
      const checkoutStore = useCheckoutStore();
      const { product_list } = storeToRefs(checkoutStore);
      const batchesArry = [];

      if (!Array.isArray(product_list?.value)) return [];
      product_list.value.forEach(ticketList => {
        const { id } = ticketList
        this.batches.forEach(batch => {
          if (batch.selected_batch_tickets) {
            batch.tickets.filter(ticket => ticket.selected_tickets)
              .forEach(ticketEach => {
                if (id == ticketEach.id) {
                  const existingItem = batchesArry.find(item =>
                    item.id == id
                  );
                  if (existingItem) {
                    return
                  } else {
                    batchesArry.push({
                      id:ticketEach.id,
                      batch_name: batch.name,
                      batch_order: batch.order,
                      ticket_name: ticketEach.name,
                      selected_tickets: ticketEach.selected_tickets,
                      total_amount: ticketEach.amount * ticketEach.selected_tickets
                    });
                  }
                }
              });
          }
        });
      });

      batchesArry.sort((a, b) => a.batch_order - b.batch_order);
      return batchesArry;
    },
    sellerHasFeatureTickets() {
      return !!this.batches?.length;
    }
  },
  actions: {
    setBatches(value) {
      this.batches = value;
    },
    forceUpdateAvailableBatches(id) {
      return new Promise((resolve, reject) => {
        let batch = this.batches.find(x => x.id == id);
        if (batch) {
          batch.available_tickets = batch.available_tickets +1;
          resolve(); 
        } else {
          reject(new Error('Batch not found')); 
        }
      });
    },
    updateAvailableTickets(tickets, selected = false) {
      if (Array.isArray(tickets)) {
        tickets.forEach((ticket,index) => {
          let batch = this.batches.find(x => x.id == ticket.batch_id);
          if(batch){
            batch.selected_batch_tickets = batch?.selected_batch_tickets ?? 0;
            if(selected){
              batch.available_tickets = ticket.tickets
            }
          }
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
      const reservation = this.reservations.find(x => x.id == value.id);
      const index = this.reservations.indexOf(reservation);
      if (index !== -1) {
        this.reservations.splice(index, 1, value);
      }
    },
    removeReservation(value) {
      const reservation = this.reservations.find(x => x.id == value.id);
      const index = this.reservations.indexOf(reservation);
      if (index !== -1) {
        this.reservations.splice(index, 1);
      }
    },
    setLoadingReservation(value, ticket) {
      if (ticket) {
        ticket.load = value;
      }
    },
    someTotalTicket(array) {
      let totalSelectedTickets = 0;
      array.forEach(item => {
        if (item.selected_tickets) {
          totalSelectedTickets += item.selected_tickets;
        }
      });
      return totalSelectedTickets;
    },
    async checkHasTickets(offer, batch) {
      try {
        const hasTicket = await useApi().create('/event/reservation/check-amount', { offer_id: offer })
        if(!hasTicket){
          if(batch.release_type === 'fixed_date' && isTimerSameOrAfter(batch) || batch.release_type === null){
            this.hasAvailableTickets = true
            return true
          }
          this.hasAvailableTickets = false
          return false
        }
        this.hasAvailableTickets = true
        return hasTicket
      } catch (error) {
        console.error(error)
      }
    },
    async addTicket(batch_group, hash) {
      let batch = this.batches.find(x => x.id == batch_group.id);
      let ticket = batch.tickets.find(x => x.hash === hash);
      try {
        this.setLoadingReservation(true, ticket);
        await this.checkHasTickets(ticket.id, batch)
        if (!haveAvailableTickets(batch)) {
          batch.soldOff = true
          return 'Sem ingresso disponível'
        } else {
          batch.soldOff = false
        }
        if (haveAvailableTickets(batch) && saleHasStarted(batch) && !dependsOnAnotherBatch(batch)) {
          const checkoutStore = useCheckoutStore();
          if (batch.release_type !== "fixed_date" && batch.release_type !== null) {
            let resp = await this.createReservation(ticket.id, ticket);
            if (resp) {
              ticket.selected_tickets += 1;
              batch.selected_batch_tickets = this.someTotalTicket(batch.tickets);
              localStorage.setItem('reservations', JSON.stringify(this.reservations));
              checkoutStore.setProductListPreCheckout({ ...ticket, user_identification:resp.token });
              return resp.token
            }
          } else {
            ticket.selected_tickets += 1;
            batch.selected_batch_tickets = this.someTotalTicket(batch.tickets);
            // Para eventos que estão configurados para liberar por data || esgotar lote || sem regra
            checkoutStore.setProductListPreCheckout({ ...ticket, user_identification:hash });
          }
        }
        return true
      } catch (error) {
        return error
      } finally {
        this.setLoadingReservation(false, ticket);
      }
    },
    async subTicket(batch_group, hash) {
      const batch = this.batches.find(x => x.id == batch_group.id);
      let ticket = batch.tickets.find(x => x.hash == hash);
      this.setLoadingReservation(true, ticket);
      if (ticket?.selected_tickets > 0 && saleHasStarted(batch)) {
        ticket.selected_tickets -= 1;
        batch.selected_batch_tickets = this.someTotalTicket(batch.tickets);

        const checkoutStore = useCheckoutStore();
        const addProduct = false
        checkoutStore.setProductListPreCheckout(ticket, addProduct);
        // if(ticket.selected_tickets === 0) {
        // Deleta a reserva do lote existente, já que foram removidos todos ingressos
        if(batch.release_type !== "fixed_date" && batch.release_type !== null){
          const reservation = this.reservations.find(x => x.offer_id == ticket.id);
          await this.deleteReservation(reservation, ticket);
          await this.checkHasTickets(ticket.id)
          localStorage.setItem('reservations', JSON.stringify(this.reservations));
        }else{
          // Para eventos que estão configurados para liberar por data || esgotar lote || sem regra
          this.updateAvailableTickets(batch.tickets, false);
        }
        // } else {
        //   // Edita a reserva do lote existente com a nova quantidade de ingressos selecionados
        //   const res = await this.putReservation(ticket);
        //   localStorage.setItem('reservations', JSON.stringify(this.reservations))
        // }
      }
      this.setLoadingReservation(false, ticket);
    },
    async createReservation(offer_id, ticket, batch_id) {
      const start = new Date();
      const end = new Date(start.getTime());
      end.setMinutes(end.getMinutes() + 10);
      const payload = { start, end, offer_id, quantity: 1 };
      this.setLoadingReservation(true, ticket);
      try {
        const res = await useApi().create('/event/reservation', payload);
        if (res === null) {
          this.soldOffTickets = true
          const toast = Toast.useToast();
          toast.error("Ingressos esgotados.");
          throw new Error; 
        } else {
          this.soldOffTickets = false
          this.addReservation({ ...res, offer_id, offer_group_id:ticket.offer_group_id });
          this.updateAvailableTickets(res.tickets, false);
        }
        return res;
      } catch (err) {
        this.hasAvailableTickets = false
        if(err?.value?.status === 422){
          const toast = Toast.useToast();
          toast.warning("Ingresso configurado com data limite para vendas não tem controle de reservas.");
          throw new Error; 
        }
        return false;
      } finally {
        this.setLoadingReservation(false, ticket);
      }
    },
    async putReservation(ticket) {
      const reservation = this.reservations.find(x => x.offer_id == ticket.id);
      const payload = { ...reservation, quantity: ticket.selected_tickets };
      this.setLoadingReservation(true, ticket);
      try {
        const res = await useApi().update(`/event/reservation/${payload.token}`, payload);
        this.updateReservation({ ...res, offer_id: ticket.id });
        this.updateAvailableTickets(res.tickets, false);
        return res;
      } catch (err) {
        console.error(err);
        return err;
      } finally {
        this.setLoadingReservation(false, ticket);
      }
    },
    async deleteReservation(reservation, ticket, preCheckout = false, checkout = false) {
      if(!ticket && !preCheckout || (ticket && !preCheckout && checkout)) return;
      const reservations = localStorage.getItem('reservations');
      if (reservations && !preCheckout) {
        this.setLoadingReservation(true, ticket);
      }
        try {
          const res = await useApi().remove(`/event/reservation/${reservation.token}`);
          if (this.reservations?.length) this.removeReservation(reservation);
          localStorage.removeItem('reservations');
          this.batches.forEach(batch => {
            if (batch.tickets.some(x => x.id == reservation.offer_id)) {
              this.updateAvailableTickets(res.tickets, false);
            }
          })
          return res;
        } catch (err) {
          console.error(err)
          return err;
        } finally {
          if(reservations && !preCheckout) this.setLoadingReservation(false, ticket);
        }
    }
  }
});
