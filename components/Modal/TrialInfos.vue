<script setup lang="ts">
const props = defineProps({
  name: {
    type: String,
    required: true,
  },
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
  period: {
    type: Number,
    default: 0,
  },
});
</script>
<template>
  <h6 class="subtitle">
    {{ $t("pg_obrigado.modal.agradecemos") }}
  </h6>
  <p class="paragraph">
    {{ $t("pg_obrigado.modal.vc_adquiriu") }}
    {{ name ?? "produto" }}
  </p>
  <p class="paragraph">
    {{ $t("pg_obrigado.modal.detalhes_email") }}
  </p>
  <p class="paragraph">
    ✨ {{ $t("pg_obrigado.modal.produto_trial") }} {{ period }}
    {{ $t("pg_obrigado.modal.dias_teste") }}
  </p>
  <div class="details py-5">
    <h6 class="title">
      {{ $t("pg_obrigado.modal.detalhes_compra") }}
    </h6>
    <div class="item">
      <p>{{ $t("pg_obrigado.modal.codigo_transacao") }}</p>
      <p>#{{ id }}</p>
    </div>
    <div class="item">
      <div class="flex items-start">
        <div class="icon icon-success"></div>
        <div class="transaction">
          <p>{{ name }}</p>
          <span>{{ $t("pg_obrigado.modal.transacao") }}</span>
        </div>
      </div>
      <p>{{ amount }}</p>
    </div>
  </div>
</template>
