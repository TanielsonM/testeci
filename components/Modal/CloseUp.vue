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

let lastScrollPosition = 0;

const expirationDate = new Date();

const handleScroll = () => {
  if (closeUpModalCookie.value !== false) {
    const currentScrollPosition =
      window.scrollY || document.documentElement.scrollTop;

    if (currentScrollPosition < lastScrollPosition) {
      setTimeout(function () {
        closeUpModal.value = true;
        closeUpModalCookie.value = false;
        closeUpModalCookie.expires = expirationDate.setDate(
          expirationDate.getDate() + 7
        );
      }, 4000);
    } else {
      closeUpModal.value = false;
    }
    lastScrollPosition = currentScrollPosition;
  }
};

function closeModal() {
  closeUpModal.value = false;
}

onMounted(() => {
  window.addEventListener("scroll", handleScroll);
});

onBeforeUnmount(() => {
  window.removeEventListener("scroll", handleScroll);
});
</script>

<template>
  <!--- Close Up Modal -->
  <BaseModal
    :is-open="closeUpModal"
    :show-close="false"
    @close="closeModal"
    :style="{ 'padding: 0px': closeUpOnlyImage === true }"
  >
    <section
      class="flex w-full max-w-[400px] flex-col gap-5"
      :class="{ '-mt-[70px]': closeUpOnlyImage === false }"
    >
      <section v-if="closeUpOnlyImage" class="margin-top-fix">
        <Icon
          name="mdi:close"
          class="cursor-close cursor-pointer text-gray-400"
          size="25"
          @click="closeModal"
        />
        <a :href="customCheckoutStore.popUpLink">
          <img class="rounded" :src="customCheckoutStore.popUpImage" />
        </a>
      </section>

      <section v-else :class="{ 'p-[5px]': closeUpOnlyImage === false }">
        <h6
          class="flex-content mb-[8px] text-[17px] font-semibold text-txt-color"
        >
          {{ customCheckoutStore.popUpTitle }}
          <Icon
            name="mdi:close"
            class="cursor-pointer text-gray-400"
            size="25"
            @click="closeModal"
          />
        </h6>

        <section>
          <img
            class="mb-[30px] rounded"
            :src="customCheckoutStore.popUpImage"
          />
        </section>

        <p class="mt-2 justify-end text-sm text-txt-color">
          {{ customCheckoutStore.popUpDescription }}
        </p>
        <section class="mt-3 flex w-full justify-end">
          <a :href="customCheckoutStore.popUpLink" class="mt-[20px] w-full">
            <BaseButton
              class="bg-main-color text-txt-color"
              @click="closeModal"
            >
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

.margin-top-fix {
  position: relative;
  margin-top: -59px;
}
</style>
