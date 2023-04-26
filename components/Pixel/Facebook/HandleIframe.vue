<script lang="ts" setup>
const props = defineProps({
  product_id: {
    type: String,
    required: false,
    default: () => null,
  },
  pixel_id: {
    type: String,
    required: false,
    default: () => null,
  },
  host: {
    type: String,
    required: false,
    default: () => null,
  },
  event: {
    type: String,
    required: false,
    default: () => null,
  },
  event_id: {
    type: String,
    required: false,
    default: () => null,
  },
  affiliate_id: {
    type: String,
    required: false,
    default: () => null,
  },
  amount: {
    type: String,
    required: false,
    default: () => null,
  },
  method: {
    type: String,
    required: false,
    default: () => null,
  },
  sale_id: {
    type: String,
    required: false,
    default: () => null,
  },
  original_amount: {
    type: String,
    required: false,
    default: () => 0,
  },
});

onMounted(() => {
  if (process.client) {
    const iframe = document.createElement("iframe");
    iframe.src = `https://${props.host}/${props.product_id}?event=${props.event}&event_id=${props.event_id}&pixel_id=${props.pixel_id}${props.method}&amount=${props.amount}&a_id=${props.affiliate_id}&s_id=${props.sale_id}&original_amount=${props.original_amount}`;
    iframe.width = 1;
    iframe.height = 1;
    iframe.style.display = "none";
    document.querySelector("body").appendChild(iframe);
  }
});
</script>
<template></template>
