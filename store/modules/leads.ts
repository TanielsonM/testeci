import { v4 as uuidv4 } from "uuid";
import { leadsState } from "@/types";
import { useCheckoutStore } from "../checkout";
import { storeToRefs } from "pinia";

const checkoutStore = useCheckoutStore();
const { uuid } = storeToRefs(checkoutStore);

export const useLeadsStore = definePiniaStore("Leads", {
  state: (): leadsState => ({
    step: 1,
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
      proposal_id: 0,
      product_id: 0,
      seller_id: 0,
      affiliate_id: 0,
    },
    purchase: {
      status: false,
    },
  }),
  persist: true,
  getters: {},
  actions: {
    async sendLead(): Promise<void> {
      const api = useApi();
      const query = { uuid: this.uuid, product_id: this.payment.product_id };

      try {
        const getLead = await api.read("/lead", { query }).then((res) => {
          res.test;
        });
      } catch (error) {}
    },
  },
});
