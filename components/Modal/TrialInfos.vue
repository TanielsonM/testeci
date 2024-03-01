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
    type: [String, Number],
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
  <div v-if="!!data.bump?.sales" v-for="sale in data.bump?.sales">
    <hr />
    <div class="details py-5">
      <div class="item">
        <p>{{ $t("pg_obrigado.modal.codigo_transacao") }}</p>
        <p>#{{ sale.id }}</p>
      </div>
      <div class="item" v-if="sale.status === 'trialing'">
        <div class="flex items-start">
          <div class="check-icon icon-success"></div>
          <div class="transaction">
            <p>{{ sale.product?.name }}</p>
            <span>{{ $t("pg_obrigado.modal.transacao") }}</span>
          </div>
        </div>
        <p>
          {{
            sale.amount == 0
              ? $t("checkout.pagamento.bump.free")
              : formatMoney(sale.amount)
          }}
        </p>
      </div>
      <div class="item" v-else>
        <div class="transaction">
          <p>{{ sale.product?.name }}</p>
        </div>
        <p>
          {{
            sale.amount == 0
              ? $t("checkout.pagamento.bump.free")
              : formatMoney(sale.amount)
          }}
        </p>
      </div>
      <div class="item" v-if="sale.shipping_amount > 0">
        <p>{{ $t("pg_obrigado.modal.frete") }}</p>
        <p>{{ formatMoney(sale.shipping_amount) }}</p>
      </div>
    </div>
    <div v-if="sale.method == 'BOLETO'">
      <ModalTicketInfos
        :code="sale.boleto_barcode"
        :url="sale.boleto_url"
        :id="sale.id.toString()"
        :amount="formatMoney(sale.amount)"
        :last="true"
        :name="sale.product.name"
        :shipping-amount="formatMoney(sale.shipping_amount)"
        :only-code="true"
        :status="sale.status"
      />
    </div>
  </div>
</template>
