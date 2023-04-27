<script lang="ts" setup>
import { useProductStore } from "@/store/product";
import { useCheckoutStore } from "@/store/checkout";
import { usePixelStore } from "~~/store/modules/pixel";

// Stores
const productStore = useProductStore();
const checkoutStore = useCheckoutStore();
const pixelStore = usePixelStore();

const props = defineProps({
  event: {
    required: false,
  },
  product_id: {
    required: false,
  },
  affiliate_id: {
    required: false,
  },
  method: {
    required: false,
  },
  amount: {
    required: false,
  },
  original_amount: {
    required: false,
  },
  email: {
    required: false,
  },
  cellphone: {
    required: false,
  },
  sale_id: {
    required: false,
  },
  chc_id: {
    required: false,
  },
});

onMounted(() => {
  if (process.client) {
    handleEvent(
      props.event,
      props.product_id,
      props.affiliate_id,
      props.method,
      props.amount,
      props.sale,
      props.sale_id,
      props.chc_id
    );

    function handleIframe(
      product_id,
      pixel_id,
      host,
      event,
      event_id,
      affiliate_id,
      amount,
      method,
      sale_id,
      original_amount
    ) {
      const iframe = document.createElement("iframe");
      iframe.src = `https://${host}/${product_id}?event=${event}&event_id=${event_id}&pixel_id=${pixel_id}&method=${method}&amount=${amount}&a_id=${affiliate_id}&s_id=${sale_id}&original_amount=${original_amount}`;
      iframe.width = 1;
      iframe.height = 1;
      iframe.style.display = "none";
      document.querySelector("body").appendChild(iframe);
    }

    function handleEvent(
      event,
      product_id,
      affiliate_id,
      method,
      amount,
      original_amount,
      em,
      ph,
      sale_id,
      chc_id
    ) {
      pixelStore.syncPixels();

      const pixels = pixelStore.getPixels(
        event,
        product_id,
        pixelStore.event_id,
        method,
        affiliate_id,
        amount,
        sale_id,
        chc_id,
        em,
        ph
      );

      if (pixels && pixels.length) {
        pixels.forEach((pixel) => {
          this.handleIframe(
            product_id,
            pixel.id,
            pixel.host,
            event,
            pixelStore.event_id,
            affiliate_id,
            amount,
            method,
            sale_id,
            original_amount
          );
        });
      }
    }
  }
});
</script>

<template></template>
