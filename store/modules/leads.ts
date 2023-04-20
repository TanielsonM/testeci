import { v4 as uuidv4 } from "uuid";
import { leadsState } from "@/types";
import { useCheckoutStore } from "../checkout";
import { storeToRefs } from "pinia";

const checkoutStore = useCheckoutStore();
const { uuid } = storeToRefs(checkoutStore);

export const useLeadsStore = definePiniaStore("Leads", {
  state: (): leadsState => ({
    uuid: uuid.value,
    personal: {
      name: "",
    },
    address: {},
    purchase: {},
  }),
  persist: true,
  getters: {},
  actions: {
    async sendLeads(): Promise<void> {},
  },
});
