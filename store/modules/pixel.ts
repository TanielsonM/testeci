import { type pixelState, type Pixel } from "@/types";
import { v4 as uuidv4 } from "uuid";
import { useProductStore } from "../product";
import { useCheckoutStore } from "../checkout";
import { usePersonalStore } from "../forms/personal";
import { useAmountStore } from "./amount";
import { useLeadsStore } from "@/store/modules/leads";

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

export function leadsStore(){
  const store = useLeadsStore()
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
    name: undefined,
    zip_code: '',
    state: '',
    city: '',
    country_code: '',
    products_ids: '',
  }),
  getters: {},
  actions: {
    getOrderBumps(sales){
      let ids = [];
      let allSales = sales;
      if(allSales && allSales.sales){
        ids = allSales.sales
        .filter((item: any) => item.product_id != productStore().product_id)
        .map((item: any) => item.product_id);
      } 
      return ids;
    },
    async syncPixels(event: string, amount: any) {
      this.event = event;
      this.product_id = productStore().product_id;
      this.method = checkoutStore().method;
      this.products_ids = this.getOrderBumps(checkoutStore().sales);
      this.affiliate_id = checkoutStore().hasAffiliateId;
      this.email = personalStore().email;
      this.cellphone = personalStore().cellphone;
      this.amount = amount || amountStore().amount;
      this.name = personalStore().name;
      this.zip_code = leadsStore().address?.zip_code
      this.state = leadsStore().address?.state
      this.city = leadsStore().address?.city
      this.country_code = leadsStore().address?.country_code

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
        a_id: this.affiliate_id,
        name: this.name,
        zip_code: this.zip_code,
        state: this.state,
        city: this.city,
        country_code: this.country_code,
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
