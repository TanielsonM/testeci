<script setup>
import { storeToRefs } from "pinia";
import { useCheckoutStore } from "~~/store/checkout";

const checkout = useCheckoutStore();
const { method } = storeToRefs(checkout);

// Component forms
const CREDIT_CARD = resolveComponent("FormPurchaseCreditCard");
const BOLETO = resolveComponent("FormPurchaseBoleto");
const PIX = resolveComponent("FormPurchasePix");
// const PAYPAL = resolveComponent("FormPurchasePaypal");
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
    case "TWO_CREDIT_CARD":
      return CREDIT_CARD;
    case "BOLETO":
      return BOLETO;
    // case "PAYPAL":
    //   return PAYPAL;
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
</script>

<template>
  <span data-anima="top" class="flex w-full flex-col gap-8">
    <component :is="selectedForm" />
  </span>
</template>
