<script setup lang="ts">
import { Sale } from "@/types";
import { formatMoney } from "@/utils/money";
import { useModalStore } from "~~/store/modal/success";

const modal = useModalStore();
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
  shippingAmount: {
    type: String,
    default: null,
    required: false,
  },
  period: {
    type: Number,
    default: 0,
  },
  bump: {
    type: Object,
  },
});

const data = ref({
  bump: props.bump as Sale,
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
        <div class="check-icon icon-success"></div>
        <div class="transaction">
          <p>{{ name }}</p>
          <span>{{ $t("pg_obrigado.modal.transacao") }}</span>
        </div>
      </div>
      <p>{{ amount == "0" ? $t("checkout.pagamento.bump.free") : amount }}</p>
    </div>
    <div class="item" v-if="!!shippingAmount">
      <p>{{ $t("pg_obrigado.modal.frete") }}</p>
      <p>{{ shippingAmount }}</p>
    </div>
  </div>
  <div v-if="!!data.bump?.sales">
    <hr />
    <div class="details py-5">
      <div class="item">
        <p>{{ $t("pg_obrigado.modal.codigo_transacao") }}</p>
        <p>#{{ data.bump.sales[0].id }}</p>
      </div>
      <div class="item">
        <p>{{ data.bump.sales[0].product?.name }}</p>
        <p>
          {{
            data.bump.sales[0].amount == 0
              ? $t("checkout.pagamento.bump.free")
              : formatMoney(data.bump.sales[0].amount)
          }}
        </p>
      </div>
      <div class="item" v-if="data.bump.sales[0].shipping_amount > 0">
        <p>{{ $t("pg_obrigado.modal.frete") }}</p>
        <p>{{ formatMoney(data.bump.sales[0].shipping_amount) }}</p>
      </div>
    </div>
    <div v-if="data.bump.sales[0].method == 'BOLETO'">
      <ModalTicketInfos
        :code="data.bump.sales[0].boleto_barcode!"
        :url="data.bump.sales[0].boleto_url!"
        :id="data.bump.sales[0].id.toString()"
        :amount="formatMoney(data.bump.sales[0].amount)"
        :last="true"
        :name="data.bump.sales[0].product.name"
        :shipping-amount="formatMoney(data.bump.sales[0].shipping_amount)"
        :only-code="true"
      />
    </div>
  </div>
</template>
