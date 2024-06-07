import { pixelState, Pixel } from "@/types";
import { v4 as uuidv4 } from "uuid";
import { useProductStore } from "../product";
import { useCheckoutStore } from "../checkout";
import { usePersonalStore } from "./../forms/personal";
import { useAmountStore } from "./amount";

// const productStore = useProductStore();
// const checkoutStore = useCheckoutStore();
// const personalStore = usePersonalStore();
// const amountStore = useAmountStore();

export function productStore() {
  const store = useProductStore();
  return store;
}

export function checkoutStore() {
  const store = useCheckoutStore();
  return store;
}

export function personalStore() {
  const store = usePersonalStore();
  return store;
}

export function amountStore() {
  const store = useAmountStore();
  return store;
}

export const usePixelStore = defineStore("Pixel", {
  state: (): pixelState => ({
    event: "view",
    product_id: 0,
    event_id: uuidv4(),
    method: "",
    affiliate_id: 0,
    amount: 0,
    original_amount: 0,
    sale_id: undefined,
    client_has_contract: undefined,
    email: undefined,
    cellphone: undefined,
  }),
  getters: {},
  actions: {
    async syncPixels(event: string, amount: any) {
      this.event = event;
      this.product_id = productStore().product_id;
      this.method = checkoutStore().method;
      this.affiliate_id = checkoutStore().hasAffiliateId;
      this.email = personalStore().email;
      this.cellphone = personalStore().cellphone;
      this.amount = amount || amountStore().amount;
    },
    async getPixels(): Promise<{ event_id: string; pixels: Pixel[] }> {
      const query = {
        product_id: this.product_id,
        event: this.event,
        event_id: this.event_id,
        method: this.method,
        sale_id: this.sale_id,
        chc_id: this.client_has_contract,
        em: this.email,
        ph: this.cellphone ? this.cellphone.replace(/\D/g, "") : this.cellphone,
        amount: this.amount,
        a_id: this.affiliate_id
      };

      return await useApi()
        .read("lexip", { query })
        .then((response) => {
          if (response) {
            return response;
          }

          return {};
        });
    },
  },
});
