import { v4 as uuidv4 } from "uuid";
import { leadsState } from "@/types";
import { useCheckoutStore } from "../checkout";
import { useProductStore } from "../product";

import { storeToRefs } from "pinia";

const productStore = useProductStore();
const checkoutStore = useCheckoutStore();

const { seller_id } = storeToRefs(productStore);
const { uuid, product_offer, product_id, hasAffiliateId } =
  storeToRefs(checkoutStore);

export const useLeadsStore = defineStore("Leads", {
  state: (): leadsState => ({
    step: 0,
    id: uuid.value,
    uuid: uuid.value,
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
      complement: "",
      neighborhood: "",
      country_code: "",
    },
    payment: {
      offer_hash: product_offer,
      proposal_id: 0,
      product_id: product_id,
      seller_id: seller_id,
      affiliate_id: hasAffiliateId,
    },
    purchase: {
      status: false,
    },
  }),
  persist: {
    paths: ["uuid"],
  },
  getters: {},
  actions: {
    async sendLead(): Promise<void> {
      const data = {};

      const api = useApi();
      const query = { uuid: this.uuid, product_id: this.payment.product_id };

      try {
        const getLead = await api.read("/lead", { query }).then((res) => {
          console.log(res);
          if (res.uuid === this.uuid) {
          }
        });
      } catch (error) {}
    },
  },
});
