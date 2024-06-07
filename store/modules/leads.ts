// Imports necessários
import { defineStore, storeToRefs } from "pinia";
import { usePersonalStore } from "@/store/forms/personal";
import { useAddressStore } from "@/store/forms/address";
import { useProductStore } from "@/store/product";
import { useCheckoutStore } from "@/store/checkout";
import { GreennLogs } from "@/utils/greenn-logs";
import { type leadsState } from "@/types";
import useApi from "@/composables/useApi";

// Definição do store de Leads
export const useLeadsStore = defineStore("Leads", {
  state: (): leadsState => ({
    step: 0,
    uuid: null,
    personal: {
      name: null,
      email: null,
      cellphone: null,
      document: null,
    },
    address: {
      zip_code: "",
      state: "",
      city: "",
      street: "",
      number: "",
      neighborhood: "",
      complement: "",
      country_code: "BR",
    },
    payment: {
      offer_hash: 0,
      proposal_id: 0,
      product_id: 0,
      seller_id: 0,
      affiliate_id: 0,
    },
    purchase: {
      status: "",
    },
  }),
  actions: {
    changeStep(step: number) {
      this.step = step;
    },
    changePaymentStatus(status: string) {
      this.purchase.status = status;
    },
    setUUID(uuid: string) {
      this.uuid = uuid;
    },
    syncPersonal() {
      const personalStore = usePersonalStore();
      this.personal = {
        name: personalStore.name,
        email: personalStore.email,
        cellphone: personalStore.cellphone,
        document: personalStore.document,
      };

      if (
        this.personal.name &&
        this.personal.email &&
        this.personal.cellphone &&
        this.personal.document &&
        this.step <= 0
      ) {
        this.changeStep(1);
      }
    },
    syncAddress() {
      const addressStore = useAddressStore();
      this.address = {
        zip_code: addressStore.charge.zipcode,
        state: addressStore.charge.state,
        city: addressStore.charge.city,
        street: addressStore.charge.street,
        number: addressStore.charge.number,
        neighborhood: addressStore.charge.neighborhood,
        complement: addressStore.charge.complement,
        country_code: "BR",
      };

      if (
        this.address?.zip_code &&
        this.address?.state &&
        this.address?.street &&
        this.address?.number &&
        this.address?.neighborhood &&
        this.step <= 1
      ) {
        this.changeStep(2);
      }
    },
    syncPayment() {
      const checkoutStore = useCheckoutStore();
      const productStore = useProductStore();
      const { product_id, hasAffiliateId, product_offer } =
        storeToRefs(checkoutStore);
      const { seller_id } = storeToRefs(productStore);

      this.payment = {
        offer_hash: product_offer.value,
        proposal_id: 0,
        product_id: product_id.value,
        seller_id: seller_id.value,
        affiliate_id: hasAffiliateId.value,
      };
    },
    async syncLead() {
      // Implementação de chamada de API para sincronizar ou recuperar um lead
      const response = await useApi().read("/lead", {
        query: { uuid: this.uuid, product_id: this.payment.product_id },
      });

      if (response && response.uuid) {
        this.step = response.step;
        this.uuid = response.uuid;
        this.personal = response.personal;
        this.address = response.address;
      } else {
        this.createLead();
      }
    },
    async createLead(): Promise<void> {
      const data = {
        product_id: Number(this.payment.product_id),
        seller_id: this.payment.seller_id,
        country_code: this.address.country_code ?? "BR",
        uuid: this.uuid,
        step: this.step
      };

      await useApi()
        .create("/lead", data, {}, false, false)
        .then(() => {
          GreennLogs.logger.info("Lead criado com sucesso", {
            uuid: this.uuid,
          });
        });
    },
    async updateLead() {
      if (this.uuid) {
        try {
          let updatedCellphone = this.personal?.cellphone;
          if (this.personal?.cellphone !== null && updatedCellphone) {
            updatedCellphone = updatedCellphone.replace(/\s/g, "");
          }

          const data = {
            product_id: Number(this.payment.product_id),
            proposal_id: this.payment.proposal_id,
            seller_id: this.payment.seller_id,
            affiliate_id: this.payment.affiliate_id,
            name: this.personal.name,
            email: this.personal.email,
            cpf: this.personal.document,
            zip_code: this.address?.zip_code,
            street: this.address?.street,
            number: this.address?.number,
            neighborhood: this.address?.neighborhood,
            city: this.address?.city,
            state: this.address?.state,
            step: this.step,
            uuid: this.uuid,
            complement: this.address.complement,
            country_code: this.address.country_code,
            status: this.purchase.status,
            cellphone: updatedCellphone,
          };

          await useApi()
            .update(`lead/${this.uuid}`, data, {}, false, false)
            .then((res) => {
              return res;
            });
        } catch (error) {
          console.error(error);
        }
      }
    },
  },
});
