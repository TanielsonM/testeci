<script setup>
import { useGoBackToPrecheckoutStore } from "~~/store/modal/goBackToPrecheckout";
import { goBackToPreCheckout } from "@/utils/validateBatch";
import moment from "moment";

const goBackToPrecheckout = useGoBackToPrecheckoutStore();
const productStore = useProductStore();
const { product } = storeToRefs(productStore);

function closeModal() {
  goBackToPrecheckout.setShowModal(false);
}
</script>

<template>
  <BaseModal :title="product.name + ' | ' + moment(product.start_date).format('DD') + ' de ' + moment(product.start_date).format('MMM').toUpperCase().charAt(0) + moment(product.start_date).format('MMM').slice(1)" :is-open="goBackToPrecheckout.showModal" @close="closeModal">
    <section class="flex w-full max-w-[400px] flex-col gap-5 p-6">
      <p class="text-txt-color text-center font-bold">{{ $t("checkout.modal.text_ticket") }}</p>
      <p class="text-center text-gray-500">{{ $t("checkout.modal.text_session") }}</p>
      <section class="mt-1 grid w-full gap-2 ">
        <BaseButton
          color="light"
          class="w-[100%] text-txt-color"
          @click="goBackToPreCheckout"
        >
        {{ $t("checkout.modal.text_button_pre") }}
        </BaseButton>
      </section>
    </section>
  </BaseModal>
</template>