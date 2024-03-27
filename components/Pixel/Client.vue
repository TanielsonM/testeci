<script lang="ts" setup>
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
  sale_id?: number;
  chc_id?: number;
  product_name?: string;
}

const pixelStore = usePixelStore();
const props = defineProps<Props>();

onMounted(async () => {
  if (process.client) {
    pixelStore.amount = props.amount;
    pixelStore.original_amount = props.original_amount;
    pixelStore.sale_id = props.sale_id;
    pixelStore.client_has_contract = props.chc_id;

    await pixelStore.syncPixels(props.event, props.amount);
    await pixelStore.getPixels().then((response) => {
      const { event_id, pixels } = response;

      if (pixels && pixels.length) {
        const hasTagManager = pixels.filter(
          (item) => item.type == "GOOGLETAGMANAGER"
        );

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
            props.original_amount
          );
        });
      }
    });

    function onCheckoutEvent() {
      dataLayer.push({
        event: 'checkout',
        checkout: {
          products: [
            {
              amount: props.amount || props.original_amount,
              product_name: props.product_name,
              product_id: props.product_id,
            },
          ],
        },
      });
    }

    function onPurchaseEvent() {
      dataLayer.push({
        event: "purchase",
        purchase: {
          sale_id: props.sale_id,
          method: props.method,
          products: [
            {
            amount: props.amount || props.original_amount,
            product_id: props.product_id,
            product_name: props.product_name,
            }
          ],
        },
      });
    }
  
    function handleGtag(pixel_id: string, product_id: number, user_id: number, host: string,) {
      (function (w: any, d: any, s: any, l: any, i: any) {
        w[l] = w[l] || [];
        w[l].push({ "gtm.start": new Date().getTime(), event: "gtm.js" });
        var f = d.getElementsByTagName(s)[0],
          j = d.createElement(s),
          dl = l != "dataLayer" ? "&l=" + l : "";
        j.async = true;
        j.src = "https://www.googletagmanager.com/gtm.js?id=" + i + dl;
        f.parentNode.insertBefore(j, f);
      })(window, document, "script", "dataLayer", pixel_id);

      let data = {
        column: 'events_triggered_count',
        seller_id: `${user_id}`,
        pixel_id: `${pixel_id}`,
        product_id: `${product_id}`,
    };

    fetch(`https://${host}/api/lexip/metrics`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });

      
    }

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
      original_amount: number
    ) {
      const url = `https://${host}/${product_id}`;
      const query = new URLSearchParams();

      if (!!event) query.append("event", event);
      if (!!event_id) query.append("event_id", event_id);
      if (!!pixel_id) query.append("pixel_id", pixel_id.toString());
      if (!!method) query.append("method", method);
      if (!!amount) query.append("amount", amount.toString());
      if (!!affiliate_id) query.append("affiliate_id", affiliate_id.toString());
      if (!!sale_id) query.append("sale_id", sale_id.toString());
      if (!!original_amount)
        query.append("original_amount", amount.toString());

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
