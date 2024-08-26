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
    eventsDefault: true,
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
    fbp:'',
    switchProductList: false
  }),
  
  getters: {
    getEventsDefault(state){
      return state.pixels?.some(pixel => !pixel.pixel_configuration?.length)
    },
    getViewPixelIds(state){
      if(this.getEventsDefault) {
        const viewConfigs = state.pixels?.filter(pixel => !pixel.pixel_configuration?.length && pixel.view)
        const viewConfigsIds = viewConfigs?.map(x => x.id)
        return viewConfigsIds
      }
      return []
    },
    getPageView(state){
      return state.pixels?.some(pixel => pixel.pixel_configuration?.some(x=> x.event === 'PageView' && x.is_active))
    },
    getPageViewPixelIds(state){
      if(this.getPageView) {
        const pageViewConfigs = state.pixels?.filter(pixel => pixel.pixel_configuration?.some(x=> x.event === 'PageView' && x.is_active))
        const pageViewConfigsIds = pageViewConfigs?.map(x => x.id)
        return pageViewConfigsIds
      }
      return []
    },
    getViewContent(state){
      return state.pixels?.some(pixel => pixel.pixel_configuration?.some(x=> x.event === 'ViewContent' && x.is_active))
    },
    getViewContentPixelIds(state) {
      if(this.getViewContent) {
        const viewContentConfigs = state.pixels?.filter(pixel => pixel.pixel_configuration?.some(x=> x.event === 'ViewContent' && x.is_active))
        const viewContentConfigsIds = viewContentConfigs?.map(x => x.id)
        return viewContentConfigsIds
      }
      return []
    },
    getInitiateCheckoutOnAccess(state){
      return state.pixels?.some(pixel => pixel.pixel_configuration?.some(x=> x.event === 'InitiateCheckout' && x.is_active && x.action === 'on_access'))
    },
    getInitiateCheckoutOnFilledData(state){
      return state.pixels?.some(pixel => pixel.pixel_configuration?.some(x=> x.event === 'InitiateCheckout' && x.is_active && x.action === 'on_filled_data'))
    },
    getInitiateCheckoutAccessPixelIds(state) {
      if(this.getInitiateCheckoutOnAccess) {
        const initiateCheckoutConfigs = state.pixels?.filter(pixel => pixel.pixel_configuration?.some(x => x.event === 'InitiateCheckout' && x.is_active && x.action === 'on_access'))
        const initiateCheckoutConfigsIds = initiateCheckoutConfigs?.map(x => x.id)
        return initiateCheckoutConfigsIds
      }
      return []
    },
    getInitiateCheckoutFilledDataPixelIds(state) {
      if(this.getInitiateCheckoutOnFilledData) {
        const initiateCheckoutConfigs = state.pixels?.filter(pixel => pixel.pixel_configuration?.some(x=> x.event === 'InitiateCheckout' && x.is_active && x.action === 'on_filled_data'))
        const initiateCheckoutConfigsIds = initiateCheckoutConfigs?.map(x => x.id)
        return initiateCheckoutConfigsIds
      }
      return []
    },
    getAddPaymentInfo(state){
      return state.pixels?.some(pixel => pixel.pixel_configuration?.some(x=> x.event === 'AddPaymentInfo' && x.is_active))
    },
    getAddPaymentInfoPixelIds(state) {
      if(this.getAddPaymentInfo) {
        const addPaymentInfoConfigs = state.pixels?.filter(pixel => pixel.pixel_configuration?.some(x=> x.event === 'AddPaymentInfo' && x.is_active))
        const addPaymentInfoConfigsIds = addPaymentInfoConfigs?.map(x => x.id)
        return addPaymentInfoConfigsIds
      }
      return []
    },
    getAddToCartOnMainProduct(state){
      return state.pixels?.some(pixel => pixel.pixel_configuration?.some(x=> x.event === 'AddToCart' && x.is_active && x.action === 'on_main_product'))
    },
    getAddToCartOnOrderBump(state){
      return state.pixels?.some(pixel => pixel.pixel_configuration?.some(x=> x.event === 'AddToCart' && x.is_active && x.action === 'on_orderbump'))
    },
    getAddToCartPixelIds(state) {
      if(this.getAddToCartOnMainProduct || this.getAddToCartOnOrderBump) {
        const addToCartConfigs = state.pixels?.filter(pixel => pixel.pixel_configuration?.some(x=> x.event === 'AddToCart' && x.is_active))
        const addToCartConfigsIds = addToCartConfigs?.map(x => x.id)
        return addToCartConfigsIds
      }
      return []
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
    getPurchaseTryPixelIds(state) {
      if(this.getPurchaseTry) {
        const purchaseConfigs = state.pixels?.filter(pixel => pixel.pixel_configuration?.some(x=> x.event === 'Purchase' && x.is_active && x.action === 'on_payment_try'))
        const purchaseConfigsIds = purchaseConfigs?.map(x => x.id)
        return purchaseConfigsIds
      }
      return []
    },
    getPurchaseSuccessPixelIds(state) {
      if(this.getPurchaseSuccess) {
        const purchaseConfigs = state.pixels?.filter(pixel => pixel.pixel_configuration?.some(x=> x.event === 'Purchase' && x.is_active && x.action === 'on_payment_success'))
        const purchaseConfigsIds = purchaseConfigs?.map(x => x.id)
        return purchaseConfigsIds
      }
      return []
    },
    getPurchasePaidPixelIds(state) {
      if(this.getPurchasePaid) {
        const purchaseConfigs = state.pixels?.filter(pixel => pixel.pixel_configuration?.some(x=> x.event === 'Purchase' && x.is_active && x.action === 'on_payment_paid'))
        const purchaseConfigsIds = purchaseConfigs?.map(x => x.id)
        return purchaseConfigsIds
      }
      return []
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
    getOrderBumpPurchaseTryPixelIds(state) {
      if(this.getOrderBumpPurchaseTry) {
        const orderBumpPurchaseConfigs = state.pixels?.filter(pixel => pixel.pixel_configuration?.some(x=> x.event === 'OrderBumpPurchase' && x.is_active && x.action === 'on_payment_try'))
        const orderBumpPurchaseConfigsIds = orderBumpPurchaseConfigs?.map(x => x.id)
        return orderBumpPurchaseConfigsIds
      }
      return []
    },
    getOrderBumpPurchaseSuccessPixelIds(state) {
      if(this.getOrderBumpPurchaseSuccess) {
        const orderBumpPurchaseConfigs = state.pixels?.filter(pixel => pixel.pixel_configuration?.some(x=> x.event === 'OrderBumpPurchase' && x.is_active && x.action === 'on_payment_success'))
        const orderBumpPurchaseConfigsIds = orderBumpPurchaseConfigs?.map(x => x.id)
        return orderBumpPurchaseConfigsIds
      }
      return []
    },
    getOrderBumpPurchasePaidPixelIds(state) {
      if(this.getOrderBumpPurchasePaid) {
        const orderBumpPurchaseConfigs = state.pixels?.filter(pixel => pixel.pixel_configuration?.some(x=> x.event === 'OrderBumpPurchase' && x.is_active && x.action === 'on_payment_paid'))
        const orderBumpPurchaseConfigsIds = orderBumpPurchaseConfigs?.map(x => x.id)
        return orderBumpPurchaseConfigsIds
      }
      return []
    },
    getStartTrial(state){
      return state.pixels?.some(pixel => pixel.pixel_configuration?.some(x=> x.event === 'StartTrial' && x.is_active))
    },
    getStartTrialPixelIds(state) {
      if(this.getStartTrial) {
        const startTrialConfigs = state.pixels?.filter(pixel => pixel.pixel_configuration?.some(x=> x.event === 'StartTrial' && x.is_active))
        const startTrialConfigsIds = startTrialConfigs?.map(x => x.id)
        return startTrialConfigsIds
      }
      return []
    },
    getSwitchProductList(state){
      return state.switchProductList
    }
  },
  actions: {
    getOrderBumps(sales: any){
      let ids = [];
      let allSales = sales;
      if(allSales && allSales.sales){
        ids = allSales.sales
        .filter((item: any) => item.product_id != productStore().product_id)
        .map((item: any) => item.product_id+'_'+item.amount);
      } else if(checkoutStore().product_list?.length > 1) {
        ids = checkoutStore().product_list
        .filter((item: any) => item.id != productStore().product_id)
        .map((item: any) => item.product_id+'_'+item.amount);
      }
      return ids;
    },
    async syncPixels(event: string, amount: any, orderbump = null) {
      try {
        this.event = event;
        this.product_id = orderbump ? orderbump.id : productStore().product_id;
        this.productCategory = productStore().productCategory?.name
        this.productName = orderbump ? orderbump.offer_name : productStore().productName
        this.productUrl =  window.location.href
        this.referrerUrl = document.referrer
        this.method = checkoutStore().method;
        this.products_ids = orderbump ? null : this.getOrderBumps(checkoutStore().sales);
        this.affiliate_id = checkoutStore().hasAffiliateId;
        this.email = personalStore().email;
        this.cellphone = personalStore().cellphone;
        this.amount = orderbump ? orderbump.amount : (amount || amountStore().amount);
        this.name = personalStore().name;
        this.zip_code = leadsStore().address?.zip_code
        this.state = leadsStore().address?.state
        this.city = leadsStore().address?.city
        this.country_code = leadsStore().address?.country_code
        this.fbc = leadsStore().fbc
        this.fbp = leadsStore().fbp
        this.original_amount = orderbump ? orderbump.amount : productStore().product?.amount
        return 'ok'
      } catch (err) {
        console.error(err)
        return err
      }
    },
    async getPixels(event: string, action: string | undefined, seller_id: string | number, contents: string): Promise<{ event_id: string; pixels: Pixel[] }> {

      const queryString = new URLSearchParams();
      queryString.append('product_id', this.product_id);
      queryString.append('productCategory', this.productCategory);
      queryString.append('productName', this.productName);
      queryString.append('productUrl', this.productUrl);
      queryString.append('event', event);
      queryString.append('event_id', this.event_id);
      queryString.append('method', this.method);
      queryString.append('sale_id', this.sale_id);
      queryString.append('referrerUrl', this.referrerUrl);
      queryString.append('chc_id', this.chc_id);
      queryString.append('em', this.em);
      queryString.append('ph', this.ph);
      queryString.append('amount', this.amount);
      queryString.append('a_id', this.a_id);
      queryString.append('name', this.name);
      queryString.append('zip_code', this.zip_code);
      queryString.append('state', this.state);
      queryString.append('city', this.city);
      queryString.append('country_code', this.country_code);
      queryString.append('products_ids', this.products_ids);
      queryString.append('fbc', this.fbc);
      queryString.append('fbp', this.fbp);
      queryString.append('seller_id', seller_id)
      queryString.append('contents', contents)
      queryString.append('original_amount', this.original_amount)
   
      if(event != 'view' && event != 'conversion') {
        switch (event) {
          case 'PageView':
            this.getPageViewPixelIds.forEach(pixel_id => {
              queryString.append('pixel_ids[]', pixel_id);
            });
            break;
          case 'ViewContent':
            this.getViewContentPixelIds.forEach(pixel_id => {
              queryString.append('pixel_ids[]', pixel_id);
            });
            break;
          case 'InitiateCheckout':
            switch (action) {
              case 'on_access':
                this.getInitiateCheckoutAccessPixelIds.forEach(pixel_id => {
                  queryString.append('pixel_ids[]', pixel_id);
                });
                break;
            
              case 'on_filled_data':
                this.getInitiateCheckoutFilledDataPixelIds.forEach(pixel_id => {
                  queryString.append('pixel_ids[]', pixel_id);
                });
                break;
            }
            break;
          case 'AddPaymentInfo':
            this.getAddPaymentInfoPixelIds.forEach(pixel_id => {
              queryString.append('pixel_ids[]', pixel_id);
            });
            break;
          case 'AddToCart':
            this.getAddToCartPixelIds.forEach(pixel_id => {
              queryString.append('pixel_ids[]', pixel_id);
            });
            break;
          case 'Purchase':
            switch (action) {
              case 'on_payment_try':
                this.getPurchaseTryPixelIds.forEach(pixel_id => {
                  queryString.append('pixel_ids[]', pixel_id);
                });
                break;
              case 'on_payment_success':
                this.getPurchaseSuccessPixelIds.forEach(pixel_id => {
                  queryString.append('pixel_ids[]', pixel_id);
                });
                break;
              case 'on_payment_paid':
                this.getPurchasePaidPixelIds.forEach(pixel_id => {
                  queryString.append('pixel_ids[]', pixel_id);
                });
                break;
            }
            break;
          case 'OrderBumpPurchase':
            switch (action) {
              case 'on_payment_try':
                this.getOrderBumpPurchaseTryPixelIds.forEach(pixel_id => {
                  queryString.append('pixel_ids[]', pixel_id);
                });
                break;
              case 'on_payment_success':
                this.getOrderBumpPurchaseSuccessPixelIds.forEach(pixel_id => {
                  queryString.append('pixel_ids[]', pixel_id);
                });
                break;
              case 'on_payment_paid':
                this.getOrderBumpPurchasePaidPixelIds.forEach(pixel_id => {
                  queryString.append('pixel_ids[]', pixel_id);
                });
                break;
            }
            break;
          case 'StartTrial':
            this.getStartTrialPixelIds.forEach(pixel_id => {
              queryString.append('pixel_ids[]', pixel_id);
            });
            break;
        }
      }

      return await useApi()
        .read("lexip/?"+queryString, )
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
    
    switchCardProductList(){
      
      this.switchProductList = false
      setTimeout(() => {
        this.switchProductList = true
      }, 1000);
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
