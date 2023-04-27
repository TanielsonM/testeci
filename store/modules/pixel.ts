import { pixelState } from "@/types";
import { v4 as uuidv4 } from "uuid";
import { useProductStore } from "../product";
import { useCheckoutStore } from "../checkout";
import { usePersonalStore } from "./../forms/personal";

const productStore = useProductStore();
const checkoutStore = useCheckoutStore();
const personalStore = usePersonalStore();

export const usePixelStore = defineStore("Pixel", {
  state: (): pixelState => ({
    event: "view",
    product_id: productStore.product_id,
    event_id: uuidv4(),
    method: checkoutStore.method,
    affiliate_id: checkoutStore.hasAffiliateId,
    amount: productStore.amount,
    sale_id: 0,
    client_has_contract: 0,
    email: personalStore.email,
    cellphone: personalStore.cellphone,
  }),
  getters: {},
  actions: {
    syncPixels(event: string) {
      this.event = event;
      this.method = checkoutStore.method;
      this.affiliate_id = checkoutStore.hasAffiliateId;
      this.amount = checkoutStore.amount;
      this.sale_id = 0;
      this.client_has_contract = 0;
      this.email = "wladi@wladi.com";
      this.cellphone = "21969098986";
    },
    async getPixels(): Promise<void> {
      const url = `/api/lexip?product_id=${this.product_id}&event=${this.event}&event_id=${this.event_id}&method=${this.method}&sale_id=${this.sale_id}&chc_id=${this.client_has_contract}&em=${this.email}&ph=${this.cellphone}`;

      console.log({
        function: "getPixels",
        query: url,
      });

      await useApi()
        .read(url)
        .then((response) => {
          console.log("xd:" + response);
          return response;
        });
    },
  },
});
