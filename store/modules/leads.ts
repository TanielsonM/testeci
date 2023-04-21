import { storeToRefs } from "pinia";
import { leadsState } from "@/types";
import { useCheckoutStore } from "../checkout";
import { useProductStore } from "../product";

const productStore = useProductStore();
const checkoutStore = useCheckoutStore();

const { seller_id } = storeToRefs(productStore);
const { product_id } = storeToRefs(checkoutStore);

export const useLeadsStore = defineStore("Leads", {
  state: (): leadsState => ({
    step: 0,
    uuid: "",
    personal: {
      name: "",
      email: "",
      cellphone: "",
      document: "",
    },
    address: {
      zip_code: "",
      state: "",
      city: "",
      street: "",
      number: "",
      neighborhood: "",
      complement: "",
      country_code: "",
    },
    payment: {
      offer_id: 0,
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
    async syncLead(): Promise<void> {
      const query = {
        product_id: 672,
        uuid: "e6763d33-a2ec-44f0-a305-48bcf471e3f5",
      };

      await useApi()
        .read("/lead", { query })
        .then((response) => {
          if (response) {
            checkoutStore.setUUID(response.uuid ?? this.uuid);
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

            this.payment = {
              offer_id: response.offer_id,
              proposal_id: response.proposal_id,
              product_id: response.product_id,
              seller_id: response.seller_id,
              affiliate_id: response.affiliate_id,
            };
          }
        })
        .catch((error) => {
          return error;
        });
    },

    async sendLead(): Promise<void> {
      const data = {
        step: this.step,
        uuid: this.uuid,
        id: this.uuid,

        product_id: this.payment.product_id,
        proposal_id: this.payment.proposal_id,
        seller_id: this.payment.seller_id,
        affiliate_id: this.payment.affiliate_id,

        name: this.personal.name,
        email: this.personal.email,
        cpf: this.personal.document,
        cellphone: this.personal.cellphone,

        city: this.address.city,
        state: this.address.state,
        zip_code: this.address.zip_code,
        street: this.address.street,
        number: this.address.number,
        neighborhood: this.address.neighborhood,
        complement: this.address.city,
        country_code: this.address.country_code,
      };

      const api = useApi();
      const query = { product_id: this.payment.product_id, uuid: this.uuid };

      try {
        const getLead = await api.read("/lead", { query }).then((res) => {
          return res.data;
        });
      } catch (error) {}
    },
  },
});
