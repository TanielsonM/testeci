<script lang="ts" setup>
import { v4 as uuidv4 } from "uuid";
import { useProductStore } from "~~/store/product";
import { useCheckoutStore } from "~~/store/checkout";

const productStore = useProductStore();
const checkoutStore = useCheckoutStore();

const props = defineProps({
  event: {
    type: String,
    required: false,
    default: () => "view",
  },
  product_id: {
    type: Number,
    required: false,
    default: () => null,
  },
  original_amount: {
    type: Number,
    required: false,
    default: () => null,
  },
  affiliate_id: {
    type: [Number, String],
    required: false,
    default: () => null,
  },
  method: {
    type: String,
    required: false,
    default: () => null,
  },
  sale: {
    type: String,
    required: false,
    default: () => null,
  },
  sale_id: {
    type: Number,
    required: false,
    default: () => null,
  },
  chc_id: {
    type: Number,
    required: false,
    default: () => null,
  },
  ph: {
    type: String,
    required: false,
    default: () => null,
  },
  em: {
    type: String,
    required: false,
    default: () => null,
  },
  s_id: {
    type: Number,
    required: false,
    default: () => null,
  },
  a_id: {
    type: Number,
    required: false,
    default: () => null,
  },
});

const pixels = ref();

onMounted(async () => {
  if (process.client) {
    const query = {
      product_id: props.product_id,
      event: props.event,
      event_id: uuidv4(),
      method: props.method,
      amount: props.amount,
      original_amount: props.original_amount,
      a_id: props.a_id,
      s_id: props.s_id,
      chc_id: props.chc_id,
      em: props.em,
      ph: props.ph,
    };

    const syncLead = await useApi()
      .read("/lexip", { query })
      .then((response) => {
        return (pixels.value = response);
      })
      .catch((error) => {
        console.log(error);
      });
    console.log({ test: query });
  }
});
</script>

<template>
  <div v-if="pixels">
    <PixelFacebookHandleIframe
      v-for="(data, index) in pixels.value"
      :key="index"
      :product_id="data.product_id"
      :pixel_id="data.pixel.id"
      :host="data.pixel.host"
      :event="data.event"
      :event_id="data.event_id"
      :affiliate_id="data.affiliate_id"
      :amount="data.amount"
      :method="data.method"
      :sale_id="data.sale_id"
      :original_amount="data.original_amount"
    />
  </div>
</template>
