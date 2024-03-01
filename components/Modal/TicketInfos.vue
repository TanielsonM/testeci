<script setup lang="ts">
import * as Toast from "vue-toastification";
const { t } = useI18n();
const props = defineProps({
  name: {
    type: String,
    required: true,
  },
  code: {
    type: String,
    default: "",
    required: true,
  },
  url: {
    type: String,
    default: "",
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
  shippingAmount: {
    type: [String, Number],
    default: null,
    required: false,
  },
  shippingSelected: {
    type: Object,
    default: null,
    required: false,
  },
  last: {
    type: Boolean,
    default: false,
  },
  onlyCode: {
    type: Boolean,
    default: false,
  },
  index: {
    type: Number,
    default: 0,
  },
  installments: {
    type: Number,
    default: () => 0,
  },
  status: {
    type: String,
    default: "",
  },
  order: {
    type: Object,
    default: {},
  },
  sale: {
    type: Object,
    default: {},
  },
});

const openTicket = (url: any) => {
  window.open(url);
};

const copy = (id: string) => {
  const input = document.querySelector(`#${id}`) as HTMLInputElement;
  input.select();
  document.execCommand("copy");

  const toast = Toast.useToast();
  toast.info(
    `${t("pg_obrigado.modal.copiado")}\n${t(
      "pg_obrigado.modal.codigo_copiado"
    )}`
  );
};

onMounted(() => {
  console.log(props.shippingAmount);
  console.log(props.shippingSelected);
  console.log(props.sale);
})
</script>
<template>
  <div v-if="!onlyCode">
    <h6 class="subtitle" v-if="index === 0">
      {{ $t("pg_obrigado.modal.prazo_pagar") }}
    </h6>
    <p class="paragraph" v-if="index === 0">
      {{ $t("pg_obrigado.modal.internet_banking") }}
    </p>
    <p class="paragraph" v-if="index === 0">
      {{ $t("pg_obrigado.modal.recebe_email") }}
    </p>
    <p class="paragraph" v-if="index === 0">
      {{ $t("pg_obrigado.modal.compensacao") }}
    </p>
    <p class="paragraph" v-if="!!installments && installments > 1">
      ✨ {{ $t("pg_obrigado.modal.compra_parcelada") }} {{ installments }}x
    </p>
    <div class="details py-5">
      <h6 class="title" v-if="index == 0">
        {{ $t("pg_obrigado.modal.detalhes_compra") }}
      </h6>
      <div class="item">
        <p>{{ $t("pg_obrigado.modal.codigo_transacao") }}</p>
        <p>#{{ id }}</p>
      </div>

      <div class="item" v-if="status == 'trialing'">
        <div class="flex items-start">
          <div class="check-icon icon-success"></div>
          <div class="transaction">
            <p>{{ name }}</p>
            <span>{{ $t("pg_obrigado.modal.transacao") }}</span>
          </div>
        </div>
        <p>{{ amount }}</p>
      </div>
      <div class="item" v-if="status != 'trialing'">
        <p>{{ name }}</p>
        <p>{{ amount }}</p>
      </div>
      <div class="item" v-if="(!!shippingAmount && shippingAmount != 'R$ 0,00') || (!!shippingSelected && !shippingAmount && shippingSelected.service_name === 'GRÁTIS')">
        <p>{{ $t("pg_obrigado.modal.frete") }}</p>
        <p>{{ shippingAmount || `Grátis` }}</p>
      </div>
    </div>
  </div>

  <div
    class="actions my-3 grid grid-cols-12 gap-3"
    :class="!last ? 'mb-5 pb-5' : ''"
    v-if="(!!code && order && last) || (!!code && !order)"
  >
    <BaseInput
      class="col-span-12 lg:col-span-5"
      :input-id="`ticket_${id}`"
      :readonly="true"
      :model-value="code"
      custom-class="readonly-button"
    />
    <BaseButton
      color="blue"
      size="vsm"
      animation="pulse"
      class="col-span-12 lg:col-span-4"
      @click="() => copy(`ticket_${id}`)"
      >{{ $t("pg_obrigado.modal.btn_codigo") }}</BaseButton
    >
    <BaseButton
      color="info"
      size="vsm"
      animation="pulse"
      class="col-span-12 lg:col-span-3"
      @click="() => openTicket(url)"
      >{{ $t("pg_obrigado.modal.imprimir_boleto") }}</BaseButton
    >
  </div>
  <hr v-if="!last && !onlyCode" class="my-5" />
</template>
<style lang="scss">
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
