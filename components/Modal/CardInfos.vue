<script setup>
import { formatMoney } from "@/utils/money";

const props = defineProps({
  name: {
    default: null,
    required: false,
  },
  id: {
    default: null,
    required: false,
  },
  installments: {
    default: null,
    required: false,
  },
  sales: {
    default: null,
    required: false,
  },
  shippingAmount: {
    type: String,
    default: null,
    required: false,
  },
  shippingSelected: {
    type: String,
    default: null,
    required: false,
  },
  onlyButtons: {
    type: Boolean,
    default: false,
  },
});

const data = ref({
  shippingSelected: props.shippingSelected ? JSON.parse(props.shippingSelected): {},
  showCode: false,
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
  <p class="paragraph py-2" v-if="!!installments && installments > 1">
    ✨ {{ $t("pg_obrigado.modal.compra_parcelada") }} {{ installments }}x
  </p>
  <section class="details">
    <h6 class="title">
      {{ $t("pg_obrigado.modal.detalhes_compra") }}
    </h6>
    <section v-for="(sale, index) in sales" :key="index">
      <template class="item">
        <p>{{ $t("pg_obrigado.modal.codigo_transacao") }}</p>
        <p>#{{ sale.id }}</p>
      </template>
      <template class="item">
        <section class="flex items-start">
          <section class="check-icon icon-success"></section>
          <section class="transaction">
            <p>{{ sale.product.name }}</p>
            <span>{{ $t("pg_obrigado.modal.transacao") }}</span>
          </section>
        </section>
        <p>
          {{ formatMoney(sale.total || sale.amount || sale.product.amount) }}
        </p>
      </template>
      <section class="item" v-if="!!sale.shipping_amount">
        <p>{{ $t("pg_obrigado.modal.frete") }}</p>
        <p>{{ formatMoney(sale.shipping_amount) }}</p>
      </section>
      <span
        class="my-5 block h-[1px] w-full bg-slate-300"
        v-if="index + 1 !== sales.length"
      ></span>
      <div
        class="details py-5"
        v-if="!!shippingAmount && onlyButtons && data?.shippingSelected && data.shippingSelected.frete"
      >
        <h6 class="title">
          {{ $t("pg_obrigado.modal.frete_selecionado") }}
        </h6>

        <div class="item frete">
          <div class="grid grid-cols-12 items-center gap-3">
            <div class="col-span-4">
              <img
                :src="data.shippingSelected.frete.company.picture"
                width="80"
              />
            </div>
            <div class="col-span-4">
              {{ data.shippingSelected.frete.name }}
            </div>
            <div class="col-span-4">
              {{ data.shippingSelected.frete.delivery_range.min }}
              {{ $t("checkout.address.at") }}
              {{ data.shippingSelected.frete.delivery_range.max }}
              {{ $t("checkout.address.working_days") }}
            </div>
          </div>
        </div>
      </div>
    </section>
  </section>
</template>
<style lang="scss">
.check-icon {
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
