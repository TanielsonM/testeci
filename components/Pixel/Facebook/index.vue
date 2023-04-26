<script lang="ts" setup>
import { storeToRefs } from "pinia";
import { useProductStore } from "~~/store/product";
import { useCheckoutStore } from "~~/store/checkout";
import { useAddressStore } from "@/store/forms/address";
import { useCustomCheckoutStore } from "~~/store/customCheckout";
import { usePaymentStore } from "~~/store/modules/payment";
import { useLeadsStore } from "@/store/modules/leads";

// Stores
const custom_checkout = useCustomCheckoutStore();
const productStore = useProductStore();
const checkout = useCheckoutStore();
const address = useAddressStore();
const payment = usePaymentStore();
const leadStore = useLeadsStore();

// ESSE AQUI VAI NO CHECKOUT // aqui onde eu chamo o componenet HandleEvent onde tem que ser chamado

window.pixel.handleEvent(
  "conversion",
  this.id_product,
  this.affiliate_id,
  this.method,
  amount,
  this.sale && this.sale[0].offer ? this.sale[0].offer.amount : null,
  sale_id,
  chc_id
);

this.event_was_fired = true;
// caso tenha google chame o evento getTag
this.getTagManager();
</script>
<template></template>
