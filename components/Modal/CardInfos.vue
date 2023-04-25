<script setup lang="ts">
defineProps({
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
  installments: {
    type: Number,
    required: false,
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
  <p class="paragraph py-4" v-if="!!installments">
    ✨ {{ $t("pg_obrigado.modal.compra_parcelada") }} {{ installments }}x
  </p>
  <div class="details">
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
<style lang="scss">
.icon {
  width: 1rem;
  height: 1rem;
  margin-right: 10px;
  transform: translateX(-1.5rem) translateY(0.4rem);
  position: absolute;
  background-image: url(../../assets/modal/check.svg);
}
.item {
  div {
    &.transaction {
      span {
        display: block;
        font-size: 0.75rem;
        color: #333;
        font-weight: 400;
        margin-top: -0.5rem;
      }
    }
  }
}
</style>
