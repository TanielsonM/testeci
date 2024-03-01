<script setup>
import { useGoBackToPrecheckoutStore } from "~~/store/modal/goBackToPrecheckout";
import { goBackToPreCheckout } from "@/utils/validateBatch";
import moment from "moment";

const goBackToPrecheckoutStore = useGoBackToPrecheckoutStore();
const productStore = useProductStore();
const { product } = storeToRefs(productStore);

const titleModal = computed(() => {
  return product.value.name.length > 10
    ? product.value.name.substring(0, 25) + '...' + ' | ' + moment(product.value.start_date).format('DD') + ' de ' + moment(product.value.start_date).format('MMM').toUpperCase().charAt(0) + moment(product.value.start_date).format('MMM').slice(1)
    : product.value.name + ' | ' + moment(product.value.start_date).format('DD') + ' de ' + moment(product.value.start_date).format('MMM').toUpperCase().charAt(0) + moment(product.value.start_date).format('MMM').slice(1)
});


function closeModal() {
  goBackToPrecheckoutStore.setShowModal(false);
}
</script>

<template>
  <BaseModal :title="titleModal" :is-open="goBackToPrecheckoutStore.showModal" @close="closeModal" :closeButton="true">
    <section class="flex w-full max-w-[400px] flex-col gap-5 p-6">
      <p class="text-txt-color text-center font-bold">{{ $t("checkout.modal.text_ticket") }}</p>
      <p class="text-center text-gray-500">{{ $t("checkout.modal.text_session") }}</p>
      <section class="mt-1 grid w-full gap-2 ">
        <BaseButton color="light" class="w-[100%] text-txt-color" @click="goBackToPreCheckout">
          {{ $t("checkout.modal.text_button_pre") }}
        </BaseButton>
      </section>
    </section>
  </BaseModal>
</template>