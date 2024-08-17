import { type pixelState, type Pixel, type PixelConfiguration } from "@/types";
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
interface HashOptions {
  telefone?: boolean;
  lestName?: boolean;
  firstName?: boolean;
  zipCode?: boolean; 
}
export const usePixelStore = defineStore("Pixel", {
  state: (): pixelState => ({
    event: "view",
    pixels:[],
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
    productName: '',
    productCategory: '',
    productUrl: '',
    referrerUrl: '',
    fbc:'',
    fbp:''  
  }),
  
  getters: {
    getPageView(state){
      return state.pixels?.some(pixel => pixel.pixel_configuration?.some(x=> x.event === 'PageView' && x.is_active))
    },
    getViewContent(state){
      return state.pixels?.some(pixel => pixel.pixel_configuration?.some(x=> x.event === 'ViewContent' && x.is_active))
    },
    getInitiateCheckout(state){
      return state.pixels?.some(pixel => pixel.pixel_configuration?.some(x=> x.event === 'InitiateCheckout' && x.is_active))
    },
    getAddPaymentInfo(state){
      return state.pixels?.some(pixel => pixel.pixel_configuration?.some(x=> x.event === 'AddPaymentInfo' && x.is_active))
    },
    getAddToCartOnMainProduct(state){
      return state.pixels?.some(pixel => pixel.pixel_configuration?.some(x=> x.event === 'AddToCart' && x.is_active && x.action === 'on_main_product'))
    },
    getAddToCartOnOrderBump(state){
      return state.pixels?.some(pixel => pixel.pixel_configuration?.some(x=> x.event === 'AddToCart' && x.is_active && x.action === 'on_orderbump'))
    },
    getPurchaseTry(state){
      return state.pixels?.some(pixel => pixel.pixel_configuration?.some(x=> x.event === 'Purchase' && x.is_active && x.action === 'on_payment_try'))
    },
    getPurchaseSuccess(state){
      return state.pixels?.some(pixel => pixel.pixel_configuration?.some(x=> x.event === 'Purchase' && x.is_active && x.action === 'on_payment_success'))
    },
    getPurchasePaid(state){
      return state.pixels?.some(pixel => pixel.pixel_configuration?.some(x=> x.event === 'Purchase' && x.is_active && x.action === 'on_payment_paid'))
    },
    getOrderBumpPurchaseTry(state){
      return state.pixels?.some(pixel => pixel.pixel_configuration?.some(x=> x.event === 'OrderBumpPurchase' && x.is_active && x.action === 'on_payment_try'))
    },
    getOrderBumpPurchaseSuccess(state){
      return state.pixels?.some(pixel => pixel.pixel_configuration?.some(x=> x.event === 'OrderBumpPurchase' && x.is_active && x.action === 'on_payment_success'))
    },
    getOrderBumpPurchasePaid(state){
      return state.pixels?.some(pixel => pixel.pixel_configuration?.some(x=> x.event === 'OrderBumpPurchase' && x.is_active && x.action === 'on_payment_paid'))
    },
    getStartTrial(state){
      return state.pixels?.some(pixel => pixel.pixel_configuration?.some(x=> x.event === 'StartTrial' && x.is_active))
    },
  },
  actions: {
    getOrderBumps(sales: any){
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
      this.productCategory = productStore().productCategory?.name
      this.productName = productStore().productName
      this.productUrl =  window.location.href
      this.referrerUrl = document.referrer
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
      this.fbc = leadsStore().fbc,
      this.fbp = leadsStore().fbp      
    },
    async getPixels(): Promise<{ event_id: string; pixels: Pixel[] }> {
      const query = {
        product_id: this.product_id,
        productCategory:this.productCategory,
        productName: this.productName,
        productUrl: this.productUrl,
        event: this.event,
        event_id: this.event_id,
        method: this.method,
        sale_id: this.sale_id,
        referrerUrl: this.referrerUrl,
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
        products_ids: this.products_ids,
        fbc: this.fbc,
        fbp: this.fbp,
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
    async setHahsDataPixel(data:string | undefined, options: HashOptions = {}): Promise<string>{
      //Inpede que seja feito um hash em um dado vazio 
      if(!data || data.trim() == '') return ''

      let stringLow = data.toLowerCase()
      if(options.firstName || options.lestName){
        let names = stringLow.split(' ')
        return this.encodeHash(options.firstName ? names[0]: names[1])
      }else if(options.telefone){
        return this.encodeHash(stringLow.replace(/\D/g, '')) 
      }else if(options.zipCode){
        return this.encodeHash(stringLow.substring(0, 5))
      }

      return this.encodeHash(stringLow);
    },
    
    async encodeHash(toString: string):Promise<string> {
      if(!toString || toString.trim() == '') return ''
      const encoder = new TextEncoder();
      const encodeData = encoder.encode(toString.trim());
      // Calcular o hash SHA-256
      const hashBuffer = await crypto.subtle.digest('SHA-256', encodeData);

      // Converter o ArrayBuffer para uma string hexadecimal
      const hashArray = Array.from(new Uint8Array(hashBuffer));
      const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
      return hashHex 
    },
    setPixels(value) {
      this.pixels = value
    }
  }
});
