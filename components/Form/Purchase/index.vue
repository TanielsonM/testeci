<script setup>
import { storeToRefs } from "pinia";
import { useCheckoutStore } from "~~/store/checkout";
import { useCustomCheckoutStore } from "~~/store/customCheckout";
import { useInstallmentsStore } from "~~/store/modules/installments";

const checkout = useCheckoutStore();
const product = useProductStore();
const custom_checkout = useCustomCheckoutStore();
const installmentsStore = useInstallmentsStore();

const { method, installments, max_installments, hasFees, fixed_installments, reuseCreditCard, setReuseCreditCard, secondSaleFlag, bump_list } =
  storeToRefs(checkout);
const { hasSubscriptionInstallments, productType, getPeriod } =
  storeToRefs(product);
const { trial_position } = storeToRefs(custom_checkout);
const { getInstallments } = storeToRefs(installmentsStore);
const props = defineProps({
  urlSubscription: {
    type: Boolean,
    default: false
  }
})

// Component forms
const CREDIT_CARD = resolveComponent("FormPurchaseCreditCard");
const BOLETO = resolveComponent("FormPurchaseBoleto");
const PIX = resolveComponent("FormPurchasePix");
const PAYPAL = resolveComponent("FormPurchasePaypal");
// const SAFETYPAY_CASH = resolveComponent("FormPurchaseSafetypayCash");
// const EFT = resolveComponent("FormPurchaseEFT");
// const BANKTRANSFER = resolveComponent("FormPurchaseBankTransfes");
// const DEBITCARD = resolveComponent("FormPurchaseDebitCard");
// const EFECTY = resolveComponent("FormPurchaseEfecty");
// const MULTICAJA = resolveComponent("FormPurchaseMulticaja");
// const SENCILLITO = resolveComponent("FormPurchaseSencillito");
// const SERVIPAG = resolveComponent("FormPurchaseServipag");
// const PAGOSNET = resolveComponent("FormPurchasePagosnet");
// const RAPIPAGO = resolveComponent("FormPurchaseRapipago");
// const PAGOFACIL = resolveComponent("FormPurchasePagoFacil");
// const WEBPAY = resolveComponent("FormPurchaseWebpay");
// const OXXO = resolveComponent("FormPurchaseOxxo");
// const SPEI = resolveComponent("FormPurchaseSpei");

const selectedForm = computed(() => {
  switch (method.value) {
    case "CREDIT_CARD":
      return CREDIT_CARD;
    case "TWO_CREDIT_CARDS":
      return CREDIT_CARD;
    case "BOLETO":
      return BOLETO;
    case "PAYPAL":
      return PAYPAL;
    // case "SAFETYPAY-CASH":
    //   return SAFETYPAY_CASH;
    // case "EFT":
    //   return EFT;
    // case "BANKTRANSFER":
    //   return BANKTRANSFER;
    // case "DEBITCARD":
    //   return DEBITCARD;
    // case "EFECTY":
    //   return EFECTY;
    // case "MULTICAJA":
    //   return MULTICAJA;
    // case "SENCILLITO":
    //   return SENCILLITO;
    // case "SERVIPAG":
    //   return SERVIPAG;
    // case "PAGOSNET":
    //   return PAGOSNET;
    // case "RAPIPAGO":
    //   return RAPIPAGO;
    // case "PAGOFACIL":
    //   return PAGOFACIL;
    // case "WEBPAY":
    //   return WEBPAY;
    // case "OXXO":
    //   return OXXO;
    // case "SPEI":
    //   return SPEI;
    case "PIX":
      return PIX;
  }
});

const showInstallments = computed(() => {
  if (["CREDIT_CARD", "TWO_CREDIT_CARDS"].includes(method.value)) {
    if (productType.value === "SUBSCRIPTION") {
      return hasSubscriptionInstallments.value && getPeriod.value > 30;
    }
    return true;
  }
  return false;
});

// if subscription page is true
const {urlSubscription} = props;

const minInstallments = computed(() => {
  if (Array.isArray(bump_list?.value) && bump_list.value.length > 0) {
    const checkedBumps = bump_list.value.filter(bump => bump.checkbox);
    if (checkedBumps.length > 0) {
      const bumpsMaxInstallments = checkedBumps.map(bump =>  Number(bump.max_installments) || Number(bump.max_subscription_installments) || 12);
      const maxInstallmentsValue = Number(max_installments.value);
      const minInstallmentsValue = Math.min(maxInstallmentsValue, ...bumpsMaxInstallments);
      return minInstallmentsValue;
    }
  }
  return max_installments.value;
});

const showReuseCreditCard = computed(() => {
  if (["CREDIT_CARD", "TWO_CREDIT_CARDS"].includes(method.value) && secondSaleFlag.value) {
    return true;
  }
  return false;
});

function saveData() {
  setReuseCreditCard(reuseCreditCard)
};

watch([minInstallments, method], ([newVal, newMethod]) => {
  if(installments.value <= newVal ){
    return;
  }
  installments.value = newVal;
});

</script>

<template>
  <span class="flex w-full flex-col gap-5" v-if="selectedForm !== PIX">
    <transition name="slide-fade-bottom" mode="out-in">
      <component :urlSubscription="urlSubscription" :is="selectedForm" />
    </transition>
    <ClientOnly>
      <template #fallback>
        <LoadingShimmer width="50%" height="55px" />
      </template>
      <BaseSelect
        :label="$t('checkout.pagamento.metodos.um_cartao.parcelas')"
        class="w-full lg:w-1/2"
        v-model="installments"
        v-if="showInstallments && !urlSubscription"
      >
        <!-- Fixed installment -->
        <option
          :value="fixed_installments"
          v-if="!!fixed_installments"
          class="cursor-pointer select-none rounded hover:bg-main-color"
          translate="no"
        >
          {{
            `${fixed_installments}x ${hasFees ? "" : "(Sem juros)"} ${$t(
              "order.de"
            )} ${formatMoney(getInstallments())}${hasFees ? "*" : ""}`
          }}
        </option>
        <!-- Installments -->
        <option
          v-else
          v-for="(d, index) in minInstallments"
          :key="index"
          :value="d"
          class="cursor-pointer select-none rounded hover:bg-main-color"
          translate="no"
        >
          {{
            index + 1 > 1
              ? `${index + 1}x ${hasFees ? "" : "(Sem juros)"} ${$t(
                  "order.de"
                )} ${formatMoney(getInstallments(index + 1))}${
                  hasFees ? "*" : ""
                }`
              : `${index + 1}x ${$t("order.de")} ${formatMoney(
                  getInstallments(1)
                )}`
          }}
        </option>
      </BaseSelect>
      <!-- checkbox to save data of credit card -->
      <BaseCheckbox
        v-if="showReuseCreditCard"
        :saveData="true"
        v-model:checked="reuseCreditCard"
        :label="`${$t('checkout.salvar_dados')}`"
        @click="saveData()"
        :id="'reuseCreditCardCheckbox'"
      />
    </ClientOnly>
    <InfoTrial class="w-2/3" v-if="trial_position == 'bottom'" />
  </span>
</template>
