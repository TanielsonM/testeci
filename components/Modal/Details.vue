<script setup lang="ts">
defineProps({
  id: {
    type: String,
    default: "",
    required: true,
  },
  amount: {
    type: String,
    default: "",
    required: true,
  },
});
</script>
<template>
  <div class="details py-5">
    <h6 class="title">{{ $t("pg_obrigado.modal.detalhes_compra") }}</h6>
    <div class="item">
      <p>{{ $t("pg_obrigado.modal.codigo_transacao") }}</p>
      <p>#{{ id }}</p>
    </div>
    <div class="item">
      <p>Venda</p>
      <p>{{ amount }}</p>
    </div>
  </div>
</template>
