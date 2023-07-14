<script setup>
import { storeToRefs } from "pinia";
import { useCustomCheckoutStore } from "~~/store/customCheckout";

const store = useCustomCheckoutStore();
const { showWhatsappButton, whatsapp_options } = storeToRefs(store);
const openWhatsapp = () => {
  window.open(
    `https://wa.me/${whatsapp_options.value.number
      .substring(3)
      .replace(".", "")}?text=${whatsapp_options.value.message.replace(
      " ",
      "%20"
    )}`,
    "blank"
  );
};
</script>

<template>
  <section
    class="whatsapp fixed bottom-10 right-10 flex h-[60px] w-[60px] cursor-pointer items-center justify-center rounded-full bg-[#25d366]"
    v-if="
      showWhatsappButton && whatsapp_options.number && whatsapp_options.message
    "
    @click="openWhatsapp"
  >
    <Icon name="mdi:whatsapp" size="40" class="text-white" />
  </section>
</template>

<style lang="scss" scoped>
.whatsapp {
  transition: ease-in-out 200ms;

  &:hover {
    transform: scale3d(1.1, 1.1, 1.1);
  }
}
</style>
