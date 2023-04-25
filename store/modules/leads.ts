import { leadsState } from "@/types";
import { usePersonalStore } from "./../forms/personal";
import { useProductStore } from "../product";
import { useCheckoutStore } from "../checkout";
import { storeToRefs } from "pinia";

const personalStore = usePersonalStore();
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
      const query = {
        uuid: this.uuid,
        product_id: this.payment.product_id,
      };

      console.log({
        function: "syncLead",
        data: query,
      });

      await useApi()
        .read("/lead", { query })
        .then((response) => {
          console.log({ response });
          if (response.uuid) {
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
        .catch((error) => {
          console.log(error);
        });
    },
    async createLead(): Promise<void> {
      const data = {
        product_id: this.payment.product_id,
        seller_id: this.payment.seller_id,
        country_code: this.address.country_code ?? "BR",
        uuid: this.uuid,
        step: 0,
      };

      console.log({
        function: "createLead",
        data: data,
      });

      await useApi()
        .create("/lead", data)
        .then((response) => {
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
