<script setup>
import { storeToRefs } from "pinia";
import { usePersonalStore } from "~~/store/forms/personal";
import { usePaymentStore } from "~~/store/modules/payment";
import logoPayPal from "@/assets/paypal/logo.svg";

import { validateFirstStep } from "@/rules/form-validations";
import { validate } from "vee-validate";

const { locale } = useI18n();
const paypal = ref(null);
const productStore = useProductStore();
const checkoutStore = useCheckoutStore();
const personalStore = usePersonalStore();
const paymentStore = usePaymentStore();

const { productName, seller_id } = storeToRefs(productStore);
const {
  product_id,
  product_offer,
  hasAffiliateId,
  checkoutPayment,
  selectedCountry,
} = storeToRefs(checkoutStore);

const { email } = storeToRefs(personalStore);

onMounted(async () => {
  setTimeout(() => {
    if (process.client) {
      window.paypal
        .Buttons({
          locale: "pt_BR",
          style: {
            size: "responsive",
            color: "black",
            label: "buynow",
            branding: true,
          },
          onClick: (data, actions) => {
            actions.reject();
            return actions.resolve();
          },
          createOrder: (data, actions) => {
            return actions.order.create({
              purchase_units: [
                {
                  description: productName.value,
                  amount: {
                    value: checkoutPayment.value.paypal.amount,
                    currency_code: checkoutPayment.value.paypal.currency,
                  },
                  reference_id: JSON.stringify({
                    product_id: product_id.value,
                    affiliate_id: hasAffiliateId.value || null,
                    seller_id: seller_id.value,
                    offer_hash: product_offer.value || null,
                    // rate: this.rate.token,
                    country: selectedCountry.value,
                    email: email.value,
                  }),
                },
              ],
              application_context: {
                shipping_preference: "NO_SHIPPING",
              },
            });
          },
          onApprove: async (data, actions) => {
            await actions.order.capture().then(function (details) {
              paymentStore.payment(locale.value, details);
            });
          },
          onError: (err) => {
            console.error(err);
            paymentStore.validateError("PayPal");
          },
        })
        .render(paypal.value);
    }
  }, 300);
});
</script>
<template>
  <ClientOnly>
    <div
      ref="paypal"
      data-anima="top"
      :class="{ hidden: !validateFirstStep() }"
    ></div>
    <BaseButton color="paypal" :disabled="true" v-if="!validateFirstStep()">
      <span class="mr-1 text-[15px] font-semibold">
        <img :src="logoPayPal" class="w-20" />
      </span>
      <p class="text-lg">Comprar agora</p>
    </BaseButton>
  </ClientOnly>
</template>
