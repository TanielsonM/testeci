<script setup>
import { useExpiredSessionStore } from "~~/store/modal/expiredSession";
import { showUnloadAlert } from "@/utils/validateBatch";

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
    const preCheckout = usePreCheckoutStore();
    const { getBatchsList } = storeToRefs(preCheckout);
    let batchs = getBatchsList.value;
    batchs.forEach(x => {
      x.selected_tickets = 0;
    });
    preCheckout.setBatchsList(batchs);
    navigateTo(`/pre-checkout/${route.params?.product_id}`);
  }
}
</script>

<template>
  <BaseModal :title="product.name" :is-open="expiredSession.getHaveFinished" @close="closeModal">
    <section class="flex w-full max-w-[400px] flex-col gap-5">
      <h6 class="text-[15px] font-semibold text-txt-color">
        Sessão expirada
      </h6>
      <p class="text-txt-color text-justify">A sua sessão expirou, favor feche esse modal ou recarregue a página.</p>
      <section class="mt-10 flex w-full justify-end">
        <BaseButton
          color="blue"
          class="w-[40%] text-txt-color"
          @click="closeModal"
        >
          {{ $t("checkout.dados_pessoais.btn_error") }}
        </BaseButton>
      </section>
    </section>
  </BaseModal>
</template>