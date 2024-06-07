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
    isAdBlockActive(): Promise<boolean> {
      return new Promise((resolve) => {
          const testScript = document.createElement('script');
          testScript.type = 'text/javascript';
          testScript.async = true;
          testScript.src = 'https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js';
          testScript.onerror = () => resolve(true);
          testScript.onload = () => resolve(false);
  
          document.body.appendChild(testScript);
  
          setTimeout(() => {
              if (testScript.parentNode) {
                  testScript.parentNode.removeChild(testScript);
              }
          }, 1000);
      });
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
  
      // Verifica se o AdBlock está ativo
      const adBlockActive = await this.isAdBlockActive();
      if (adBlockActive) {
          console.warn("AdBlock detected, skipping API call.");
          return { event_id: "", pixels: [] };
      }
  
      try {
          const response = await useApi().read("lexip", { query });
  
          // Verifica se a resposta é um objeto válido
          if (response && typeof response === 'object' && 'event_id' in response && 'pixels' in response) {
              return response;
          } else {
              console.warn("Unexpected response format:", response);
              return { event_id: "", pixels: [] };
          }
      } catch (error) {
          console.error("API call failed:", error);
          return { event_id: "", pixels: [] };
      }
    }
  },
});
