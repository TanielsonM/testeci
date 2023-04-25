<script setup>
import { useModalStore } from "~~/store/modal/success";
const modal = useModalStore();

const props = defineProps({
  offer: {
    type: String,
    required: false,
    default: () => null,
  },
  dados_response: {
    default: () => [],
  },
  type: {
    type: String,
  },
  // flag indicando que está vindo do checkout
  isCheckout: {
    type: Boolean,
    default: false,
  },
  // METODOS DE PAGAMENTO
  methodCheckout: {
    type: String,
  },
  valor: {
    type: Number,
    default: 0,
  },
  parcelas: {
    type: Number,
    default: 1,
  },
  trial: {},

  // boleto
  boleto_url: {
    type: String,
  },
  boleto_barcode: {
    type: String,
  },
  thank_you_page: {
    type: String,
  },
  // pix
  qrcode: {
    type: String,
  },
  imgQrcode: {
    type: String,
  },
  pix: {
    type: Boolean,
  },
  name_product: {
    type: String,
  },
});
</script>
<template>
  <Head>
    <Title>Obrigado</Title>
    <Meta name="description" :content="'teste'" />
  </Head>
  <Modal>
    <ModalSuccess />
  </Modal>
  <iframe :src="modal.iframe"></iframe>
</template>
<style>
.body {
  overflow: hidden;
}
iframe {
  width: 100%;
  height: 100vh;
}
</style>
