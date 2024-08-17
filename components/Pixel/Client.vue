<script lang="ts" setup>
import { useLeadsStore } from "~/store/modules/leads";
import type { Category } from "~/types";
import { usePixelStore } from "~~/store/modules/pixel";

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
}

const pixelStore = usePixelStore();
const leadStore = useLeadsStore()
const props = defineProps<Props>();

onMounted(async () => {
  let allSales = props.products;
  let ids = [] as any;
  
  if(allSales && allSales.sales){
    ids = allSales.sales
    .filter((item: any) => item.product_id != props.product_id)
    .map((item: any) => item.product_id);
  }else if(props.products.length){
    ids = props.products
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

    await pixelStore.syncPixels(props.event, props.amount);
    await pixelStore.getPixels().then((response) => {
      const { event_id, pixels } = response;

      const eventId = event_id+'_'+props.event

      if (pixels && pixels.length) {
        pixels.forEach(async (pixel) => {     
          handleIframe(
            pixel.host,
            pixel.product_id,
            props.product_name,
            categoryName,
            productUrl,
            props.event,
            eventId,
            pixel.pixel_id,
            props.method,
            props.amount,
            props.affiliate_id,
            props.sale_id,
            props.original_amount,
            await hashData(props.name,),
            await hashData(props.email),
            await hashData(props.cellphone,{telefone: true}),
            ids ,
            props.uuid,
            await hashData(props.address?.city),
            await hashData(props.address?.country_code),
            await hashData(props.address?.state),
            await hashData(props.address?.zip_code,{zipCode:true}),
            fbc,
            fbp,
            await hashData(props.name, {lestName:true}),
            await hashData(props.name, {firstName:true}),
            document.referrer
          )
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
