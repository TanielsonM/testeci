import { leadsState } from "@/types";
import { usePersonalStore } from "./../forms/personal";
import { useAddressStore } from "./../forms/address";
import { useProductStore } from "../product";
import { useCheckoutStore } from "../checkout";

const personalStore = usePersonalStore();
const addressStore = useAddressStore();

const productStore = useProductStore();
const checkoutStore = useCheckoutStore();
const { product_id, hasAffiliateId, product_offer } =
  storeToRefs(checkoutStore);

const { seller_id } = storeToRefs(productStore);

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
  getters: {},
  actions: {
    changeStep(step: number) {
      return (this.step = step);
    },
    changePaymentStatus(status: string) {
      return (this.purchase.status = status);
    },
    setUUID(uuid: string) {
      return (this.uuid = uuid);
    },
    syncPersonal() {
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
      if (
        this.address.zip_code &&
        this.address.state &&
        this.address.street &&
        this.address.number &&
        this.address.neighborhood &&
        this.step <= 1
      ) {
        this.changeStep(2);
      }

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
    },
    syncPayment() {
      this.payment = {
        offer_hash: product_offer,
        proposal_id: 0,
        product_id: product_id,
        seller_id: seller_id,
        affiliate_id: hasAffiliateId,
      };
    },
    async syncLead(): Promise<void> {
      await useApi()
        .read(`/lead/${this.uuid}/${this.payment.product_id}`, {}, false, true)
        .then((response) => {
          if (response.uuid) {
            this.step = response.step;
            this.uuid = response.uuid ?? this.uuid;

            this.personal = {
              name: response.name,
              email: response.email,
              cellphone: response.cellphone,
              document: response.cpf,
            };

            this.address = {
              zip_code: response.zip_code,
              state: response.state,
              city: response.city,
              street: response.street,
              number: response.number,
              neighborhood: response.neighborhood,
              complement: response.complement,
              country_code: response.country_code,
            };
          } else {
            this.createLead();
          }
        })
        .catch(() => {
          this.createLead();
        });
    },
    async createLead(): Promise<void> {
      const data = {
        product_id: Number(this.payment.product_id),
        seller_id: this.payment.seller_id,
        country_code: this.address.country_code ?? "BR",
        uuid: this.uuid,
        step: 0,
      };

      await useApi()
        .create("/lead", data, {}, false, true)
        .then(() => {
          GreennLogs.logger.info("🟢 Lead criado com sucesso", {
            name: "Um lead foi adicionado",
            uuid: this.uuid,
          });
        });
    },
    async updateLead(): Promise<void> {
      if (this.uuid) {
        try {
          let updatedCellphone = this.personal.cellphone;
          if (this.personal.cellphone !== null) {
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
            zip_code: this.address.zip_code,
            street: this.address.street,
            number: this.address.number,
            neighborhood: this.address.neighborhood,
            city: this.address.city,
            state: this.address.state,
            step: this.step,
            uuid: this.uuid,
            complement: this.address.complement,
            country_code: this.address.country_code,
            status: this.purchase.status,
            cellphone: updatedCellphone,
          };

          await useApi()
            .update("lead", data, {}, false, true)
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
