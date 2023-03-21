<script setup>
import moment from "moment";
import { formatMoney } from "@/utils/money";
import { storeToRefs } from "pinia";
import { useCheckoutStore } from "@/store/checkout";
import { usePurchaseStore } from "@/store/forms/purchase";

const checkout = useCheckoutStore();
const purchase = usePurchaseStore();
const { method, installments, max_installments, getInstallments, hasFees } =
  storeToRefs(checkout);
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
  { value: 1, label: "01" },
  { value: 2, label: "02" },
  { value: 3, label: "03" },
  { value: 4, label: "04" },
  { value: 5, label: "05" },
  { value: 6, label: "06" },
  { value: 7, label: "07" },
  { value: 8, label: "08" },
  { value: 9, label: "09" },
  { value: 10, label: "10" },
  { value: 11, label: "11" },
  { value: 12, label: "12" },
];
const installmentsOptions = [{ label: "teste", value: "teste" }];
</script>

<template>
  <section class="w-full flex items-center justify-between gap-5">
    <BaseButton
      color="info"
      class="pulse flex gap-1"
      :class="{ active: method === 'CREDIT_CARD' }"
      @click="method = 'CREDIT_CARD'"
    >
      <Icon name="bi:credit-card-fill" />
      <p class="text-[80%] font-semibold">
        {{ $t("checkout.pagamento.metodos.um_cartao.title") }}
      </p>
    </BaseButton>
    <BaseButton
      color="info"
      class="pulse flex gap-1"
      :class="{ active: method === 'TWO_CREDIT_CARD' }"
      @click="method = 'TWO_CREDIT_CARD'"
    >
      <Icon name="bi:credit-card-fill" />
      <Icon name="bi:credit-card-fill" />
      <p class="text-[80%] font-semibold">
        {{ $t("checkout.pagamento.metodos.dois_cartoes.title") }}
      </p>
    </BaseButton>
  </section>
  <section class="flex gap-5 justify-between">
    <form class="grid w-full grid-cols-12 gap-3">
      <BaseInput
        :label="$t('checkout.pagamento.metodos.um_cartao.numero')"
        :placeholder="$t('checkout.pagamento.metodos.um_cartao.numero_holder')"
        class="col-span-12"
        v-mask="'#### #### #### ####'"
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
        class="col-span-4"
        :data="months"
        v-model="first.month"
      />
      <BaseSelect
        :label="$t('checkout.pagamento.metodos.um_cartao.ano')"
        :placeholder="$t('checkout.pagamento.metodos.um_cartao.ano')"
        class="col-span-4"
        :data="years"
        v-model="first.year"
      />
      <BaseInput
        :label="$t('checkout.pagamento.metodos.um_cartao.CVV')"
        :placeholder="$t('checkout.pagamento.metodos.um_cartao.CVV')"
        class="col-span-4"
        v-mask="'###'"
        v-model="first.cvv"
      />
      <BaseSelect
        :label="$t('checkout.pagamento.metodos.um_cartao.parcelas')"
        class="col-span-12"
        :data="installmentsOptions"
        v-model="installments"
      >
        <option
          v-for="(d, index) in max_installments"
          :key="index"
          :value="index + 1"
          class="select-none cursor-pointer hover:bg-main-color rounded"
        >
          {{
            index + 1 > 1
              ? `${index + 1}x ${$t("order.de")} ${formatMoney(
                  getInstallments(index + 1)
                )} ${hasFees ? "(Sem juros)" : ""}`
              : `${index + 1}x ${$t("order.de")} ${formatMoney(
                  getInstallments(1)
                )}`
          }}
        </option>
      </BaseSelect>
    </form>
    <CreditCard
      class="hidden md:block"
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