<script setup>
import moment from "moment";
import { storeToRefs } from "pinia";
import { useCheckoutStore } from "@/store/checkout";
import { useProductStore } from "@/store/product";
import { usePurchaseStore } from "@/store/forms/purchase";

const product = useProductStore();
const checkout = useCheckoutStore();
const purchase = usePurchaseStore();
const { method } = storeToRefs(checkout);
const { first, second } = storeToRefs(purchase);
const { hasSubscriptionInstallments, productType, getPeriod } =
  storeToRefs(product);

const years = [
  { value: moment().year(), label: moment().year() },
  {
    value: moment().add(1, "year").year(),
    label: moment().add(1, "year").year(),
  },
  {
    value: moment().add(2, "year").year(),
    label: moment().add(2, "year").year(),
  },
  {
    value: moment().add(3, "year").year(),
    label: moment().add(3, "year").year(),
  },
  {
    value: moment().add(4, "year").year(),
    label: moment().add(4, "year").year(),
  },
  {
    value: moment().add(5, "year").year(),
    label: moment().add(5, "year").year(),
  },
  {
    value: moment().add(6, "year").year(),
    label: moment().add(6, "year").year(),
  },
  {
    value: moment().add(7, "year").year(),
    label: moment().add(7, "year").year(),
  },
  {
    value: moment().add(8, "year").year(),
    label: moment().add(8, "year").year(),
  },
  {
    value: moment().add(9, "year").year(),
    label: moment().add(9, "year").year(),
  },
  {
    value: moment().add(10, "year").year(),
    label: moment().add(10, "year").year(),
  },
  {
    value: moment().add(11, "year").year(),
    label: moment().add(11, "year").year(),
  },
];
const months = [
  { value: "01", label: "01" },
  { value: "02", label: "02" },
  { value: "03", label: "03" },
  { value: "04", label: "04" },
  { value: "05", label: "05" },
  { value: "06", label: "06" },
  { value: "07", label: "07" },
  { value: "08", label: "08" },
  { value: "09", label: "09" },
  { value: "10", label: "10" },
  { value: "11", label: "11" },
  { value: "12", label: "12" },
];
</script>

<template>
  <section
    class="flex w-full items-center justify-between gap-5"
    data-anima="top"
  >
    <BaseButton
      color="info"
      class="pulse flex gap-1"
      :class="{ active: method === 'CREDIT_CARD' }"
      @click="checkout.setMethod('CREDIT_CARD')"
    >
      <Icon name="bi:credit-card-fill" />
      <p class="text-[90%] font-semibold">
        {{ $t("checkout.pagamento.metodos.um_cartao.title") }}
      </p>
    </BaseButton>
    <BaseButton
      color="info"
      class="pulse flex gap-1"
      :class="{ active: method === 'TWO_CREDIT_CARDS' }"
      @click="checkout.setMethod('TWO_CREDIT_CARDS')"
    >
      <Icon name="bi:credit-card-fill" />
      <Icon name="bi:credit-card-fill" />
      <p class="text-[90%] font-semibold">
        {{ $t("checkout.pagamento.metodos.dois_cartoes.title") }}
      </p>
    </BaseButton>
  </section>
  <section class="flex flex-wrap xl:flex-nowrap justify-center xl:justify-between gap-5">
    <!-- First credit card -->
    <form class="grid w-full grid-cols-12 gap-3">
      <span
        v-if="method == 'TWO_CREDIT_CARDS'"
        class="card-tag col-span-12"
        data-anima="bottom"
      >
        {{ $t("checkout.pagamento.metodos.dois_cartoes.flag") }}
        01
      </span>
      <BaseInput
        v-if="method == 'TWO_CREDIT_CARDS'"
        :label="$t('checkout.pagamento.metodos.dois_cartoes.valor')"
        :placeholder="$t('checkout.pagamento.metodos.um_cartao.numero_holder')"
        class="col-span-12"
        v-model="first.amount"
      />
      <BaseInput
        :label="$t('checkout.pagamento.metodos.um_cartao.numero')"
        :placeholder="$t('checkout.pagamento.metodos.um_cartao.numero_holder')"
        mask="#### #### #### ####"
        class="col-span-12"
        v-model="first.number"
      />
      <BaseInput
        :label="$t('checkout.pagamento.metodos.um_cartao.titular')"
        :placeholder="$t('checkout.pagamento.metodos.um_cartao.titular_holder')"
        class="col-span-12"
        v-model="first.holder_name"
      />
      <BaseSelect
        :label="$t('checkout.pagamento.metodos.um_cartao.mes')"
        :placeholder="$t('checkout.pagamento.metodos.um_cartao.mes')"
        class="col-span-6 sm:col-span-4"
        :data="months"
        v-model="first.month"
      />
      <BaseSelect
        :label="$t('checkout.pagamento.metodos.um_cartao.ano')"
        :placeholder="$t('checkout.pagamento.metodos.um_cartao.ano')"
        class="col-span-6 sm:col-span-4"
        :data="years"
        v-model="first.year"
      />
      <BaseInput
        :label="$t('checkout.pagamento.metodos.um_cartao.CVV')"
        :placeholder="$t('checkout.pagamento.metodos.um_cartao.CVV')"
        mask="###"
        class="col-span-12 sm:col-span-4"
        v-model="first.cvv"
      />
    </form>
    <!-- Second credit card -->
    <form
      class="grid w-full grid-cols-12 gap-3"
      v-if="method === 'TWO_CREDIT_CARDS'"
    >
      <span
        v-if="method == 'TWO_CREDIT_CARDS'"
        class="card-tag col-span-12"
        data-anima="bottom"
      >
        {{ $t("checkout.pagamento.metodos.dois_cartoes.flag") }}
        02
      </span>
      <BaseInput
        :label="$t('checkout.pagamento.metodos.dois_cartoes.valor')"
        :placeholder="$t('checkout.pagamento.metodos.um_cartao.numero_holder')"
        class="col-span-12"
        v-model="second.amount"
      />
      <BaseInput
        :label="$t('checkout.pagamento.metodos.um_cartao.numero')"
        :placeholder="$t('checkout.pagamento.metodos.um_cartao.numero_holder')"
        mask="#### #### #### ####"
        class="col-span-12"
        v-model="second.number"
      />
      <BaseInput
        :label="$t('checkout.pagamento.metodos.um_cartao.titular')"
        :placeholder="$t('checkout.pagamento.metodos.um_cartao.titular_holder')"
        class="col-span-12"
        v-model="second.holder_name"
      />
      <BaseSelect
        :label="$t('checkout.pagamento.metodos.um_cartao.mes')"
        :placeholder="$t('checkout.pagamento.metodos.um_cartao.mes')"
        class="col-span-6 sm:col-span-4"
        :data="months"
        v-model="second.month"
      />
      <BaseSelect
        :label="$t('checkout.pagamento.metodos.um_cartao.ano')"
        :placeholder="$t('checkout.pagamento.metodos.um_cartao.ano')"
        class="col-span-6 sm:col-span-4"
        :data="years"
        v-model="second.year"
      />
      <BaseInput
        :label="$t('checkout.pagamento.metodos.um_cartao.CVV')"
        :placeholder="$t('checkout.pagamento.metodos.um_cartao.CVV')"
        mask="###"
        class="col-span-12 sm:col-span-4"
        v-model="second.cvv"
      />
    </form>
    <CreditCard
      v-if="method !== 'TWO_CREDIT_CARDS'"
      class="hidden md:block"
      data-anima="bottom"
      :card_cvv="first.cvv"
      :card_year="first.year"
      :card_month="first.month"
      :card_number="first.number"
      :card_holder_name="first.holder_name"
    />
  </section>
</template>

<style lang="scss" scoped>
.button {
  &:hover {
    background-color: rgba(65, 137, 230, 0.2) !important;
  }
}
.active {
  background-color: rgba(65, 137, 230, 0.2) !important;
  border: 2px solid rgba(65, 137, 230, 0.2);
}
</style>
