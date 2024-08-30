<script setup>
import { useExpiredSessionStore } from "~~/store/modal/expiredSession";
import { goBackToPreCheckout } from "@/utils/validateBatch";
import moment from "moment";

const expiredSession = useExpiredSessionStore();
const productStore = useProductStore();
const { product } = storeToRefs(productStore);

function closeModal() {
  expiredSession.setHaveFinished(false);
  goBackToPreCheckout();
}
</script>

<template>
  <BaseModal :title="product.name.length > 10
    ? '🔥 ' + product.name.substring(0, 25) + '...' 
    : '🔥 ' + product.name" 
    :is-open="expiredSession.getHaveFinished" 
    @close="closeModal" 
    :closeButton="false" 
    class="w-1/2">
    <section class="flex w-full max-w-[500px] flex-col gap-5 p-10">
      <p class="flex justify-center items-center my-4">
        <img src="@/assets/icons/warning.svg" alt="warning" />
      </p>
      <p class="text-txt-color text-center font-bold">{{ $t("checkout.modal.text_expiration") }}</p>
      <p class="text-center text-gray-500">{{ $t("checkout.modal.text_loading") }}</p>
      <section class="mt-10 flex w-full">
        <BaseButton color="light" class="w-[40%] text-txt-color" @click="closeModal">
          {{ $t("checkout.modal.text_button") }}
        </BaseButton>
      </section>
    </section>
  </BaseModal>
</template>