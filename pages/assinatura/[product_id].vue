<script setup>
const { params, query, fullPath } = useRoute();
onMounted(() => {
  if (process.client) {
    const urlQuery = new URLSearchParams(query);

    if (!!params.offer) {
      window.location.href = `https://payu.greenn.com.br/assinatura/${
        params.product_id
      }/offer/${params.offer}?${urlQuery.toString()}`;
    } else {
      window.location.href = `https://payu.greenn.com.br/assinatura/${
        params.product_id
      }?${urlQuery.toString()}`;
    }
  }
});
</script>
<template></template>
