<script setup>
import moment from "moment";
import { formatMoney } from "@/utils/money";
import { storeToRefs } from "pinia";
import { useCheckoutStore } from "@/store/checkout";
import { usePurchaseStore } from "@/store/forms/purchase";
import { useAmountStore } from "~~/store/modules/amount";
import { useInstallmentsStore } from "~~/store/modules/installments";

const checkout = useCheckoutStore();
const purchase = usePurchaseStore();
const amountStore = useAmountStore();
const instStore = useInstallmentsStore();

const { getAmount } = storeToRefs(amountStore);
const { method, installments } = storeToRefs(checkout);
const { first, second } = storeToRefs(purchase);

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

function clearValue(value) {
  return parseFloat(
    value.toString().replace("R$ ", "").replace(",", ".").replace("-", "")
  ).toFixed(2);
}

function changeAmount(from) {
  // When method is diff of two credit cards, stop function
  if (method.value !== "TWO_CREDIT_CARDS") return;
  const amount = instStore.getInstallments() * installments.value;

  // when user change amount of first card, set amount of second card
  if (from === "first") {
    let value = clearValue(first.value.amount);
    // if the value of the card is greater than the total value, set the card with the entire value
    if (value >= parseFloat(amount)) {
      value = parseFloat(amount);
    }
    second.value.amount = parseFloat(amount - value).toFixed(2);
    first.value.amount = value;

    formatAmount("first");
    formatAmount("second");
    return;
  }
  let value = clearValue(second.value.amount);
  // if the value of the card is greater than the total value, set the card with the entire value
  if (value >= parseFloat(amount)) {
    value = parseFloat(amount);
  }
  first.value.amount = parseFloat(amount - value).toFixed(2);
  second.value.amount = value;
  formatAmount("first");
  formatAmount("second");
  return;
}

function formatAmount(from) {
  if (from === "first") {
    const value = parseFloat(first.value.amount.toString().replace("R$ ", ""));
    first.value.amount = formatMoney(value);
    return;
  }
  const value = parseFloat(second.value.amount.toString().replace("R$ ", ""));
  second.value.amount = formatMoney(value);
}

watch(installments, () => {
  purchase.setCardsAmount();
});
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
  <section
    class="flex flex-wrap justify-center gap-5 xl:flex-nowrap xl:justify-between"
  >
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
        @blur="changeAmount('first')"
        @vnode-before-mount="formatAmount('first')"
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
        @blur="changeAmount('second')"
        @vnode-before-mount="formatAmount('second')"
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
