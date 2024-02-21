<script setup>
import { useCustomCheckoutStore } from "~~/store/customCheckout";
import { useProductStore } from "@/store/product";

const productStore = useProductStore();
const customCheckoutStore = useCustomCheckoutStore();
const { product_id } = storeToRefs(productStore);

const closeUpModal = ref(false);
const closeUpModalCookie = useCookie(`${product_id.value}_closeUp`);

const closeUpOnlyImage = ref(
  customCheckoutStore.popUpButton === "on" ? false : true
);

const expirationDate = new Date();

const handleMouseOut = (event) => {
  if (customCheckoutStore.isPopUp === "on" && closeUpModalCookie.value !== false) {
    if (
      event.clientY <= 0 ||
      event.clientX <= 0 ||
      event.clientX >= window.innerWidth ||
      event.clientY >= window.innerHeight
    ) {
      closeUpModal.value = true;
      closeUpModalCookie.value = false;
      closeUpModalCookie.expires = expirationDate.setDate(expirationDate.getDate() + 7);
    }
  }
};

function closeModal() {
  closeUpModal.value = false;
}

onMounted(() => {
  window.addEventListener('mouseout', handleMouseOut);
});

onBeforeUnmount(() => {
  window.removeEventListener('mouseout', handleMouseOut);
});
</script>

<template>
  <!--- Close Up Modal -->
  <BaseModal :is-open="closeUpModal" :show-close="false" @close="closeModal" :closeButton="false">
    <section class="flex -mt-[70px] w-full max-w-[400px] flex-col gap-5">
      <section class="p-[5px]">
        <h6 class="flex-content mb-[8px] text-[17px] font-semibold text-txt-color">
          {{ customCheckoutStore.popUpTitle }}
          <Icon name="mdi:close" class="cursor-pointer text-gray-400" size="25" @click="closeModal" />
        </h6>

        <section>
          <a :href="customCheckoutStore.popUpLink">
            <img class="mb-[30px] rounded image-fix" :src="customCheckoutStore.popUpImage" />
          </a>
        </section>

        <p class="mt-2 justify-end text-sm text-txt-color">
          {{ customCheckoutStore.popUpDescription }}
        </p>
        <section class="mt-3 flex w-full justify-end">
          <a :href="customCheckoutStore.popUpLink" class="mt-[20px] w-full">
            <BaseButton v-if="!closeUpOnlyImage" class="bg-main-color text-txt-color" @click="closeModal">
              {{ customCheckoutStore.popUpButtonText }}
            </BaseButton>
          </a>
        </section>
      </section>
    </section>
  </BaseModal>
</template>

<style>
.flex-content {
  display: flex;
  justify-content: space-between;
}

.cursor-close {
  position: absolute;
  right: -3px;
  top: -25px;
}

.close-button {
  display: none !important;
}

.modal__content {
  padding: 10px !important;
}

@media (min-width: 690px) {
  .modal__content {
    margin-top: 100px;
  }
}

.image-fix {
  display: block;
  margin: 0 auto;
  max-height: 420px;
}

.margin-top-fix {
  position: relative;
  margin-top: -59px;
}
</style>
