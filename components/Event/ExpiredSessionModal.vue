<script setup>
import { useExpiredSessionStore } from "~~/store/modal/expiredSession";
import { showUnloadAlert, goBackToPreCheckout } from "@/utils/validateBatch";
import moment from "moment";

const expiredSession = useExpiredSessionStore();
const route = useRoute();
const productStore = useProductStore();
const { product } = storeToRefs(productStore);

function closeModal() {
  expiredSession.setHaveFinished(false);
  if(route.name === 'pre-checkout-product_id') {
    window.removeEventListener('beforeunload', showUnloadAlert);
    window.location.reload(true);
  } else {
    goBackToPreCheckout();
  }
}
</script>

<template>
  <BaseModal :title="product.name + ' | ' + moment(product.start_date).format('MM') + ' de ' + moment(product.start_date).format('MMM').toUpperCase().charAt(0) + moment(product.start_date).format('MMM').slice(1)" :is-open="expiredSession.getHaveFinished" @close="closeModal" class="w-1/2">
    <section class="flex w-full max-w-[400px] flex-col gap-5">
      <p class="flex justify-center items-center my-4">
        <img
          src="@/assets/icons/warning.svg"
          alt="warning"
        />
      </p>
      <p class="text-txt-color text-center font-bold">{{ $t("checkout.modal.text_expiration") }}</p>
      <p class="text-center text-gray-500">{{ $t("checkout.modal.text_loading") }}</p>
      <section class="mt-10 flex w-full">
        <BaseButton
          color="light"
          class="w-[40%] text-txt-color"
          @click="closeModal"
        >
          {{ $t("checkout.modal.text_button") }}
        </BaseButton>
      </section>
    </section>
  </BaseModal>
</template>