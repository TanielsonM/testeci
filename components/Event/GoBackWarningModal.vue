<script setup>
import { useGoBackToPrecheckoutStore } from "~~/store/modal/goBackToPrecheckout";
import { goBackToPreCheckout } from "@/utils/validateBatch";

const goBackToPrecheckout = useGoBackToPrecheckoutStore();
const productStore = useProductStore();
const { product } = storeToRefs(productStore);

function closeModal() {
  goBackToPrecheckout.setShowModal(false);
}
</script>

<template>
  <BaseModal :title="product.name" :is-open="goBackToPrecheckout.showModal" @close="closeModal">
    <section class="flex w-full max-w-[400px] flex-col gap-5">
      <h6 class="text-[15px] font-semibold text-txt-color">
        Alterar ingressos
      </h6>
      <p class="text-txt-color text-justify">A sua sessão ainda não expirou, caso volte a tela de pré-checkout para alterar seus ingressos irá perder seus dados salvos.</p>
      <section class="mt-10 flex w-full justify-end">
        <BaseButton
          color="blue"
          class="w-[40%] text-txt-color mr-3"
          @click="goBackToPreCheckout"
        >
          Voltar para o Pré-checkout
        </BaseButton>
        <BaseButton
          color="secondary"
          class="w-[60%] text-txt-color"
          @click="closeModal"
        >
          Cancelar
        </BaseButton>
      </section>
    </section>
  </BaseModal>
</template>