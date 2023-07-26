<script setup>
import moment from "moment";
import { formatMoney } from "@/utils/money";
import { useCheckoutStore } from "@/store/checkout";
import { useProductStore } from "@/store/product";
import { usePurchaseStore } from "@/store/forms/purchase";
import { useAmountStore } from "~~/store/modules/amount";
import { useInstallmentsStore } from "~~/store/modules/installments";
import { usePaymentStore } from "@/store/modules/payment";

import {
  validateCardAmount,
  validateCardNumber,
  validateNameOnCard,
  validateExpiryMonth,
  validateExpiryYear,
  validateCvc,
} from "@/rules/form-validations";

const checkout = useCheckoutStore();
const purchase = usePurchaseStore();
const amountStore = useAmountStore();
const prodStore = useProductStore();
const instStore = useInstallmentsStore();
const payment = usePaymentStore();

const { getAmount } = storeToRefs(amountStore);
const { method, installments, selectedCountry, allowed_methods } =
  storeToRefs(checkout);
const { productType } = storeToRefs(prodStore);
const { first, second } = storeToRefs(purchase);
const { hasSent } = storeToRefs(payment);

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

const isCardValid = ref(true);
const isCardBack = ref(false);
const creditCard = ref(null);
const isOnFocus = ref("");

function syncVerification(from) {
  verifyCard(from);
  changeAmount(from);
  onFocus("");
}

function flipCard(value) {
  isCardBack.value = value;
  onFocus(value ? "cvv" : "");
}

function onFocus(value) {
  isOnFocus.value = value;
}

function verifyCard(from) {
  let cardNumber = String(
    from == "first"
      ? first.value.number.replace(/\s+/g, "")
      : second.value.number.replace(/\s+/g, "")
  );

  const size = cardNumber.length;
  let sum = 0;
  let isSecond = false;

  for (let i = size - 1; i >= 0; i--) {
    let d = parseInt(cardNumber.charAt(i));
    if (isSecond) {
      d *= 2;
      if (d > 9) {
        d -= 9;
      }
    }
    sum += d;
    isSecond = !isSecond;
  }

  const result = sum % 10 == 0;

  isCardValid.value = !!result;
}

function changeAmount(from) {
  // When method is diff of two credit cards, stop function
  if (method.value !== "TWO_CREDIT_CARDS") return;
  const amount = instStore.getInstallments() * installments.value;
  let firstAmount = clearValue(first.value.amount) || 1;
  let secondAmount = clearValue(second.value.amount) || 1;

  if (from === "first") {
    if (firstAmount >= amount) {
      firstAmount = amount - 1;
    }
    secondAmount = amount - firstAmount;
    second.value.amount = secondAmount;
    first.value.amount = firstAmount;
  } else {
    if (secondAmount >= amount) {
      secondAmount = amount - 1;
    }
    firstAmount = amount - secondAmount;
    first.value.amount = firstAmount;
    second.value.amount = secondAmount;
  }
  formatAmount("first");
  formatAmount("second");
}

function formatAmount(from) {
  if (from === "first") {
    first.value.amount = formatMoney(clearValue(first.value.amount));
  } else {
    second.value.amount = formatMoney(clearValue(second.value.amount));
  }
}

const showCreditCardsTabs = computed(() => {
  return (
    allowed_methods.value.includes("TWO_CREDIT_CARDS") &&
    productType.value !== "SUBSCRIPTION" &&
    selectedCountry.value === "BR"
  );
});

function clearValue(value) {
  const valorSemSimbolo = value.toString().replace("R$", "");
  const numberValue = valorSemSimbolo.replace(",", ".");
  return parseFloat(parseFloat(numberValue).toFixed(2));
}

watch(installments, () => {
  purchase.setCardsAmount();
});
</script>

<template>
  <section class="flex flex-col gap-5">
    <section
      class="flex w-full items-center justify-between gap-5"
      v-if="showCreditCardsTabs"
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
        <span v-if="method == 'TWO_CREDIT_CARDS'" class="card-tag col-span-12">
          {{ $t("checkout.pagamento.metodos.dois_cartoes.flag") }}
          01
        </span>
        <BaseInput
          v-if="method == 'TWO_CREDIT_CARDS'"
          :label="$t('checkout.pagamento.metodos.dois_cartoes.valor')"
          :placeholder="
            $t('checkout.pagamento.metodos.um_cartao.numero_holder')
          "
          class="col-span-12"
          rules="required"
          v-model="first.amount"
          @click="onFocus('number')"
          @blur="syncVerification('first')"
          input-id="first-amount-field"
          :error="
            first.amount || hasSent
              ? !validateCardAmount.isValidSync(clearValue(first.amount))
              : undefined
          "
        >
          <template #error>
            {{ $t("checkout.pagamento.feedbacks.valor_cartao") }}
          </template>
        </BaseInput>

        <BaseInput
          :label="$t('checkout.pagamento.metodos.um_cartao.numero')"
          :placeholder="
            $t('checkout.pagamento.metodos.um_cartao.numero_holder')
          "
          mask="#### #### #### ####"
          class="col-span-12"
          @click="onFocus('number')"
          v-model="first.number"
          input-id="first-number-field"
          :error="
            first.number || hasSent
              ? !validateCardNumber.isValidSync(first.number.replace(/\s/g, ''))
              : undefined
          "
        >
          <template #error>
            {{ $t("checkout.cards.feedbacks.number") }}
          </template>
        </BaseInput>

        <BaseInput
          :label="$t('checkout.pagamento.metodos.um_cartao.titular')"
          :placeholder="
            $t('checkout.pagamento.metodos.um_cartao.titular_holder')
          "
          class="col-span-12"
          v-model="first.holder_name"
          @click="onFocus('name')"
          @blur="onFocus('')"
          input-id="first-holder_name-field"
          :error="
            first.holder_name || hasSent
              ? !validateNameOnCard.isValidSync(first.holder_name)
              : undefined
          "
        >
          <template #error>
            {{ $t("checkout.cards.feedbacks.holder_name") }}
          </template>
        </BaseInput>

        <BaseSelect
          :label="$t('checkout.pagamento.metodos.um_cartao.mes')"
          :placeholder="$t('checkout.pagamento.metodos.um_cartao.mes')"
          class="col-span-6 sm:col-span-4"
          :data="months"
          v-model="first.month"
          input-id="first-month-field"
          :error="
            first.month || hasSent
              ? !validateExpiryMonth.isValidSync(first.month)
              : undefined
          "
        >
          <template #error>
            {{ $t("checkout.cards.feedbacks.month") }}
          </template>
        </BaseSelect>

        <BaseSelect
          :label="$t('checkout.pagamento.metodos.um_cartao.ano')"
          :placeholder="$t('checkout.pagamento.metodos.um_cartao.ano')"
          class="col-span-6 sm:col-span-4"
          :data="years"
          v-model="first.year"
          input-id="first-year-field"
          :error="
            first.year || hasSent
              ? !validateExpiryYear.isValidSync(first.year)
              : undefined
          "
        >
          <template #error>
            {{ $t("checkout.cards.feedbacks.year") }}
          </template>
        </BaseSelect>

        <BaseInput
          :label="$t('checkout.pagamento.metodos.um_cartao.CVV')"
          mask="####"
          class="col-span-12 sm:col-span-4"
          v-model="first.cvv"
          input-id="first-cvv-field"
          :error="
            first.cvv || hasSent
              ? !validateCvc.isValidSync(first.cvv)
              : undefined
          "
          @click="flipCard(true)"
          @blur="flipCard(false)"
          @focus="flipCard(true)"
        >
          <template #error>
            {{ $t("checkout.cards.feedbacks.cvv") }}
          </template>
        </BaseInput>
      </form>

      <!-- Second credit card -->
      <form
        class="grid w-full grid-cols-12 gap-3"
        v-if="method === 'TWO_CREDIT_CARDS'"
      >
        <span v-if="method == 'TWO_CREDIT_CARDS'" class="card-tag col-span-12">
          {{ $t("checkout.pagamento.metodos.dois_cartoes.flag") }}
          02
        </span>
        <BaseInput
          :label="$t('checkout.pagamento.metodos.dois_cartoes.valor')"
          :placeholder="
            $t('checkout.pagamento.metodos.um_cartao.numero_holder')
          "
          class="col-span-12"
          v-model="second.amount"
          @blur="syncVerification('second')"
          input-id="second-amount-field"
          :error="
            second.amount || hasSent
              ? !validateCardAmount.isValidSync(clearValue(second.amount))
              : undefined
          "
        >
          <template #error>
            {{ $t("checkout.pagamento.feedbacks.valor_cartao") }}
          </template>
        </BaseInput>
        <BaseInput
          :label="$t('checkout.pagamento.metodos.um_cartao.numero')"
          :placeholder="
            $t('checkout.pagamento.metodos.um_cartao.numero_holder')
          "
          mask="#### #### #### ####"
          class="col-span-12"
          v-model="second.number"
          input-id="second-number-field"
          :error="
            second.number || hasSent
              ? !validateCardNumber.isValidSync(
                  second.number.replace(/\s/g, '')
                )
              : undefined
          "
        >
          <template #error>
            {{ $t("checkout.cards.feedbacks.number") }}
          </template>
        </BaseInput>

        <BaseInput
          :label="$t('checkout.pagamento.metodos.um_cartao.titular')"
          :placeholder="
            $t('checkout.pagamento.metodos.um_cartao.titular_holder')
          "
          class="col-span-12"
          v-model="second.holder_name"
          input-id="second-holder_name-field"
          :error="
            second.holder_name || hasSent
              ? !validateNameOnCard.isValidSync(second.holder_name)
              : undefined
          "
        >
          <template #error>
            {{ $t("checkout.cards.feedbacks.holder_name") }}
          </template>
        </BaseInput>

        <BaseSelect
          :label="$t('checkout.pagamento.metodos.um_cartao.mes')"
          :placeholder="$t('checkout.pagamento.metodos.um_cartao.mes')"
          class="col-span-6 sm:col-span-4"
          :data="months"
          v-model="second.month"
          input-id="second-month-field"
          :error="
            second.month || hasSent
              ? !validateExpiryMonth.isValidSync(second.month)
              : undefined
          "
        >
          <template #error>
            {{ $t("checkout.cards.feedbacks.month") }}
          </template>
        </BaseSelect>

        <BaseSelect
          :label="$t('checkout.pagamento.metodos.um_cartao.ano')"
          :placeholder="$t('checkout.pagamento.metodos.um_cartao.ano')"
          class="col-span-6 sm:col-span-4"
          :data="years"
          v-model="second.year"
          input-id="second-year-field"
          :error="
            second.year || hasSent
              ? !validateExpiryYear.isValidSync(second.year)
              : undefined
          "
        >
          <template #error>
            {{ $t("checkout.cards.feedbacks.year") }}
          </template>
        </BaseSelect>
        <BaseInput
          :label="$t('checkout.pagamento.metodos.um_cartao.CVV')"
          mask="####"
          class="col-span-12 sm:col-span-4"
          rules="required"
          v-model="second.cvv"
          input-id="second-cvv-field"
          :error="
            second.cvv || hasSent
              ? !validateCvc.isValidSync(second.cvv)
              : undefined
          "
        >
          <template #error>
            {{ $t("checkout.cards.feedbacks.cvv") }}
          </template>
        </BaseInput>
      </form>

      <CreditCard
        v-if="method !== 'TWO_CREDIT_CARDS'"
        class="flip-class hidden md:block"
        ref="creditCard"
        :flip_card="isCardBack"
        :card_cvv="first.cvv"
        :card_year="first.year"
        :card_month="first.month"
        :card_number="first.number"
        :card_holder_name="first.holder_name"
      />
    </section>
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
