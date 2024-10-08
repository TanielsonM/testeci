<script setup lang="ts">
import { type SaleElement } from "@/types";
import { formatMoney } from "@/utils/money";
import { useI18n } from "vue-i18n";
import { usePreCheckoutStore } from "~~/store/preCheckout";
const preCheckout = usePreCheckoutStore();
const { sellerHasFeatureTickets } = storeToRefs(preCheckout);

const { t } = useI18n();

interface InfosProps {
  name: string;
  id: string | number;
  sales: SaleElement[];
}

defineProps<InfosProps>();
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
            <p>{{ !sellerHasFeatureTickets ? sale.product.name : sale.offer.name }}</p>
            <span>{{ $t("pg_obrigado.modal.transacao") }}</span>
          </section>
        </section>
        <p>
          {{ $t('pg_obrigado.modal.gratis') }}
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
