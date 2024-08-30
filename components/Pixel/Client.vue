<script lang="ts" setup>
import { useLeadsStore } from "~/store/modules/leads";
import type { Category } from "~/types";
import { usePixelStore } from "~~/store/modules/pixel";
import { useCheckoutStore } from "~~/store/checkout";
import { useProductStore } from "~~/store/product";

// Props interface
interface Props {
  event: string;
  product_id: number;
  productCategory: Category,
  affiliate_id: number | string | null;
  method: string;
  amount: number;
  original_amount: number;
  email?: string;
  cellphone?: string;
  name?: string;
  sale_id?: number;
  chc_id?: number;
  product_name?: string;
  products?: any;
  uuid? : string;
  address?: {
    zip_code: string;
    state: string;
    city: string;
    street: string;
    number: string;
    country_code: string;
  };
  action?: string;
  seller_id: string | number;
}

const pixelStore = usePixelStore();
const leadStore = useLeadsStore()
const checkoutStore = useCheckoutStore();
const productStore = useProductStore();
const props = defineProps<Props>();

onMounted(async () => {
  let allSales = props.products;
  let ids = [] as any;
  let product_name = props.product_name;
  let product_amount = props.amount;
  let original_amount = props.original_amount;
  let selectedOrderbumpId = null;
  let selectedOrderbump = null
  let selectedOrderbumps = [];
  let currency = checkoutStore.checkoutPayment.base_currency;
  let contents = [{
      item_id: props.product_id,
      price: product_amount,
      item_category: 'product',
      item_name: product_name,
      quantity: 1
    }];
  
  if(allSales && allSales.sales){
    selectedOrderbumps = allSales.sales.filter((item: any) => item.product_id != props.product_id)
    ids = selectedOrderbumps.map((item: any) => item.product_id+'_'+item.amount);
  }else if(props?.products?.length && props.event !== 'AddToCart' && props.action !== 'on_orderbump'){
    selectedOrderbumps = checkoutStore.product_list.filter((item: any) => item.id != productStore.product_id)
    ids = selectedOrderbumps.map((item: any) => item.product_id+'_'+item.amount);
  }

  if(checkoutStore.product_list?.length > 1 && props.event === 'AddToCart' && props.action === 'on_orderbump') {
    selectedOrderbump = checkoutStore.product_list[checkoutStore.product_list.length - 1]
    product_name = selectedOrderbump.offer_name;
    product_amount = selectedOrderbump.amount;
    original_amount = selectedOrderbump.amount;
    selectedOrderbumpId = selectedOrderbump.id
    contents = [{
      item_id: selectedOrderbumpId,
      price: product_amount,
      item_category: 'product',
      item_name: product_name,
      quantity: 1
    }];
  } else if(selectedOrderbumps?.length) {
    selectedOrderbumps.forEach(ob => {
      if(props.event === 'Purchase') {
        product_amount = product_amount + ob.amount
        original_amount = original_amount + ob.amount
      }
      contents.push({
        item_id: ob.id,
        price: ob.amount,
        item_category: 'product',
        item_name: ob.offer_name,
        quantity: 1
      })
    })
  }

  if (process.client) {
    pixelStore.amount = props.amount;
    pixelStore.original_amount = props.original_amount;
    pixelStore.sale_id = props.sale_id;
    pixelStore.client_has_contract = props.chc_id;

    let fbp = useCookie('_fbp').value ?? ''
    let fbc = useCookie('_fbc').value ?? ''

    leadStore.setFbc(fbc)
    leadStore.setFbp(fbp)

    let productUrl = window.location.href
    let categoryName = props.productCategory.name ?? ''

    const hashData = pixelStore.setHahsDataPixel

    await pixelStore.syncPixels(props.event, props.amount, selectedOrderbump);
    await pixelStore.getPixels(props.event, props.action, props.seller_id, btoa(JSON.stringify(contents))).then((response) => {
      const { event_id, pixels } = response;

      let eventId = event_id+'_'+props.event
      if(props.event === 'AddPaymentInfo') {
        eventId = eventId+'_'+props.method
      }
      if(selectedOrderbumpId && checkoutStore.product_list?.length > 1 && props.event === 'AddToCart' && props.action === 'on_orderbump') {
        eventId = eventId+'_'+selectedOrderbumpId
      } else if(productStore.product_id != props.product_id && props.event === 'OrderBumpPurchase') {
        eventId = eventId+'_'+props.product_id
      } else if(props.event === 'PageView' && props.action === 'on_checkout_page') {
        eventId = eventId+'_checkout_page'
      } else if(props.event === 'PageView' && props.action === 'on_thanks_page') {
        eventId = eventId+'_thanks_page'
      }

      if (pixels && pixels.length) {
        pixels.forEach(async (pixel) => {
          const newFacebookEvents = ['PageView', 'ViewContent', 'InitiateCheckout', 'AddPaymentInfo', 'AddToCart', 'Purchase', 'OrderBumpPurchase', 'StartTrial', 'Subscribe'];
          if((pixel.type === 'FACEBOOK' && newFacebookEvents.some(x => x === props.event)) || !newFacebookEvents.some(x => x === props.event)) {
            handleIframe(
              pixel.host,
              props.event === 'OrderBumpPurchase' ? props.product_id : (selectedOrderbumpId ?? pixel.product_id),
              product_name,
              categoryName,
              productUrl,
              props.event,
              eventId,
              pixel.id,
              props.method,
              product_amount,
              props.affiliate_id,
              props.sale_id,
              original_amount,
              pixel.type != 'FACEBOOK' ? props.name : await hashData(props.name),
              pixel.type != 'FACEBOOK' ? props.email : await hashData(props.email),
              pixel.type != 'FACEBOOK' ? props.cellphone : await hashData(props.cellphone,{telefone: true}),
              ids,
              props.uuid,
              pixel.type != 'FACEBOOK' ? props.address?.city : await hashData(props.address?.city),
              pixel.type != 'FACEBOOK' ? props.address?.country_code : await hashData(props.address?.country_code),
              pixel.type != 'FACEBOOK' ? props.address?.state : await hashData(props.address?.state),
              pixel.type != 'FACEBOOK' ? props.address?.zip_code : await hashData(props.address?.zip_code,{zipCode:true}),
              fbc,
              fbp,
              await hashData(props.name, {lestName:true}),
              await hashData(props.name, {firstName:true}),
              document.referrer,
              props.seller_id,
              btoa(JSON.stringify(contents)),
              pixel.label,
              pixel.pixel_id,
              pixel.type,
              pixel.amount,
              currency,
              pixel.view
            )
          }
        });
      }
    });
    function handleIframe(
      host: string,
      product_id: number,
      productName: string | undefined,
      categoryName: string,
      productUrl: string,
      event: string,
      event_id: string,
      pixel_id: number | string,
      method: string,
      amount: number,
      affiliate_id: number | string | undefined | null,
      sale_id: number | undefined,
      original_amount: number,
      name: string | undefined,
      email: string | undefined,
      cellphone: string | undefined,
      products_ids: {}[],
      uuid: string | undefined,
      city: string | undefined,
      country_code: string | undefined,
      state: string | undefined,
      zip_code: string | undefined,
      fbc: string ,
      fbp: string ,
      lestName: string,
      firstName: string,
      referrerUrl: string | undefined,
      seller_id: string | number,
      contents: string,
      pixel_label: string | null | undefined,
      pixel_id_integration: string | null | undefined,
      pixel_type: string | null | undefined,
      use_original_amount: string | number | boolean | null | undefined,
      currency: string | null | undefined,
      pixel_view: string | number | boolean | null | undefined
    ) {
      const url = `https://${host}/${product_id}`;
      const query = new URLSearchParams();

      if (!!products_ids) query.append("products_ids", products_ids.toString());
      if (!!event) query.append("event", event);
      if (!!event_id) query.append("event_id", event_id);
      if (!!pixel_id) query.append("pixel_id", pixel_id.toString());
      if (!!method) query.append("method", method);
      if (!!amount) query.append("amount", amount.toString());
      if (!!affiliate_id) query.append("affiliate_id", affiliate_id.toString());
      if (!!sale_id) query.append("sale_id", sale_id.toString());
      if (!!original_amount)query.append("original_amount", amount.toString());
      if (!!uuid)query.append("uuid", uuid.toString());// hash
      if (!!city)query.append("city", city.toString());// hahs
      if (!!country_code)query.append("country_code", country_code.toString()); // hash
      if (!!state)query.append("state", state.toString()); //hash
      if (!!zip_code)query.append("zip_code", zip_code.toString()); // hash
      if (!!fbc)query.append("fbc", fbc.toString()); 
      if (!!fbp)query.append("fbp", fbp.toString());
      if (!!categoryName)query.append("productCategory", categoryName.toString());
      if (!!productName)query.append("productName", productName.toString());
      if (!!productUrl)query.append("productUrl", productUrl.toString());
      if (!!referrerUrl)query.append("referrerUrl", referrerUrl.toString());
      if (!!seller_id)query.append("seller_id", seller_id.toString());
      if (!!contents)query.append("contents", contents.toString());
      if (!!pixel_label)query.append("pixel_label", pixel_label.toString());
      if (!!pixel_id_integration)query.append("pixel_id_integration", pixel_id_integration.toString());
      if (!!pixel_type)query.append("pixel_type", pixel_type.toString());
      if (!!use_original_amount)query.append("use_original_amount", use_original_amount.toString());
      if (!!currency)query.append("currency", currency.toString());
      if (!!pixel_view)query.append("pixel_view", pixel_view.toString());

      if (!!name)query.append("name", name.toString()); // hash
      if (!!lestName)query.append("ln", lestName.toString()); // hash
      if (!!firstName)query.append("fn", firstName.toString()); // hash

      if (!!email)query.append("email", email.toString()); //hash
      if (!!cellphone)query.append("cellphone", cellphone.toString().replace(/\s+/g, '')); // hash

      const iframe = document.createElement("iframe");
      iframe.src = `${url}?${query.toString()}`;
      iframe.width = "1px";
      iframe.height = "1px";
      iframe.style.display = "none";

      const body = document.querySelector("body") as HTMLElement;
      body.appendChild(iframe);
    }
  }
});
</script>

<template></template>
