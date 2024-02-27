<script setup>
import { storeToRefs } from "pinia";
import { useCheckoutStore } from "~~/store/checkout";

const actual_year = computed(() => new Date().getFullYear());
const store = useCheckoutStore();
const { captchaEnabled } = storeToRefs(store);
const props = defineProps({
  installments_fee: {
    required: false,
    type: Boolean,
    default: true
  }
})
</script>

<template>
  <footer
    class="flex min-h-[45px] w-full flex-col items-start justify-center gap-2 p-4 md:items-center"
  >
    <small v-if="captchaEnabled" class="text-[12px] font-normal text-txt-color">
      {{ $t("checkout.captcha") }}
      <a class="text-[#007bff] hover:underline" href="https://policies.google.com/privacy"
        >{{ $t("checkout.captcha2") }}
      </a>
      {{ $t("checkout.captcha4") }}
      <a class="text-[#007bff] hover:underline" href="https://policies.google.com/terms">{{
        $t("checkout.captcha3")
      }}</a>
      {{ $t("checkout.captcha5") }}.
    </small>
    <p
      v-if="installments_fee"
      class="relative flex flex-nowrap text-[10px] font-normal text-txt-color md:hidden"
    >
      {{ $t("components.footer.annual_fee") }}
    </p>
    <p class="text-[10px] font-normal text-txt-color">
      Greenn © {{ actual_year }} - {{ $t("components.footer.reverved_text") }}
    </p>
  </footer>
</template>

<style lang="scss" scoped>
.footer-icons {
  filter: grayscale(100%);
  opacity: 0.3;
  width: 60px;
  height: 40px;

  &:first-child {
    width: 80px;
    height: 40px;
    object-fit: contain;
  }
}

[data-theme="dark"] {
  .footer-icons {
    opacity: 0.7;
  }
}
</style>
