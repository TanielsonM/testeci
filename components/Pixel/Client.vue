<script lang="ts" setup>
import { usePersonalStore } from "~/store/forms/personal";
import { usePixelStore } from "~~/store/modules/pixel";

// Props interface
interface Props {
  event: string;
  product_id: number;
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
}

const pixelStore = usePixelStore();
const props = defineProps<Props>();
const personalStore = usePersonalStore()

onMounted(async () => {
  let allSales = props.products;
  let ids = [] as any;
  
  if(allSales && allSales.sales){
    ids = allSales.sales
    .filter((item: any) => item.product_id != props.product_id)
    .map((item: any) => item.product_id);
  }  
  if (process.client) {
    pixelStore.amount = props.amount;
    pixelStore.original_amount = props.original_amount;
    pixelStore.sale_id = props.sale_id;
    pixelStore.client_has_contract = props.chc_id;

    await pixelStore.syncPixels(props.event, props.amount);
    await pixelStore.getPixels().then((response) => {
      const { event_id, pixels } = response;

      if (pixels && pixels.length) {
        
        pixels.forEach((pixel) => {          
          handleIframe(
            pixel.host,
            pixel.product_id,
            props.event,
            event_id,
            pixel.pixel_id,
            props.method,
            props.amount,
            props.affiliate_id,
            props.sale_id,
            props.original_amount,
            props.name,
            props.email,
            props.cellphone,
            ids
          );
        });
      }
    });

    function handleIframe(
      host: string,
      product_id: number,
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
      products_ids: {}[]
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

      if (!!name)query.append("name", name.toString());
      if (!!email)query.append("email", email.toString());
      if (!!cellphone)query.append("cellphone", cellphone.toString().replace(/\s+/g, ''));

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
