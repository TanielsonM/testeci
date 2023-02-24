<script setup>
import { useCustomCheckoutStore } from "~~/store/customCheckout";
const { showWhatsappButton, whatsapp_options } = useCustomCheckoutStore();
const openWhatsapp = () => {
  window.open(
    `https://wa.me/${
      whatsapp_options.value.number
    }?text=${whatsapp_options.value.message.replace(" ", "%20")}`,
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
