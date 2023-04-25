import { Product } from "./../../types/index";
import { storeToRefs } from "pinia";
import { leadsState } from "@/types";
import { useCheckoutStore } from "../checkout";
import { useProductStore } from "../product";

const productStore = useProductStore();
const checkoutStore = useCheckoutStore();

export const useLeadsStore = defineStore("Leads", {
  state: (): leadsState => ({
    step: 0,
    uuid: null,
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
      country_code: "BR",
    },
    payment: {
      offer_id: 0,
      proposal_id: 0,
      product_id: productStore.product_id,
      seller_id: productStore.seller_id,
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
        uuid: this.uuid,
        product_id: 673,
      };

      console.log({
        function: "syncLead",
        data: query,
      });

      const lead = await useApi()
        .read("/lead", { query })
        .then((response) => {
          if (response) {
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
          }
        })
        .catch((error) => {
          return error;
        });

      if (!lead) {
        this.createLead();
      }
    },
    async createLead(): Promise<void> {
      const data = {
        product_id: 673,
        seller_id: 278,
        country_code: "BR",
        uuid: this.uuid,
      };

      console.log({
        function: "createLead",
        data: data,
      });

      await useApi()
        .create("/lead", data)
        .then((res) => {
          GreennLogs.logger.info("🟢 Lead criado com sucesso", {
            name: "Um lead foi adicionado",
            uuid: this.uuid,
          });
        })
        .catch((error) => {
          console.log(error);
        });
    },
    async updateLead(): Promise<void> {
      const data = {
        product_id: this.payment.product_id,
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
        id: this.uuid,
        country_code: this.address.country_code,
        status: this.purchase.status,
      };

      console.log({
        function: "updateLead",
        data: data,
      });

      if (this.uuid) {
        try {
          await useApi()
            .update("lead/" + this.uuid, { data })
            .then((res) => {
              console.log(res);
            });
        } catch (error) {
          console.log(error);
        }
      }
    },
  },
});
