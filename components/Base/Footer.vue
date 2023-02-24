<script setup>
/* ligth icons */
import logo from "@/assets/logos/logo.png";
import VisaIcon from "@/assets/footer/visa.svg";
import MastercardIcon from "@/assets/footer/mastercard.svg";
import HipercardIcon from "@/assets/footer/hipercard-v2.svg";
import DinersIcon from "@/assets/footer/diners.svg";
import EloIcon from "@/assets/footer/elo.svg";
import BoletoBarcodeIcon from "@/assets/footer/boleto-barcode.svg";
/* Dark icons */
import logoDark from "@/assets/logos/logo2-dark.png";
import VisaIconDark from "@/assets/footer/visa-dark.svg";
import MastercardIconDark from "@/assets/footer/mastercard-dark.svg";
import HipercardIconDark from "@/assets/footer/hipercard-v2-dark.svg";
import DinersIconDark from "@/assets/footer/diners-dark.svg";
import EloIconDark from "@/assets/footer/elo-dark.svg";
import BoletoBarcodeIconDark from "@/assets/footer/boleto-barcode-dark.svg";

import { useCustomCheckoutStore } from "~~/store/customCheckout";

/* Variables */
const custom_checkout = useCustomCheckoutStore();

const imgs = [
  {
    src: custom_checkout.theme === "light" ? logo : logoDark,
    alt: "Greenn logo",
  },
  {
    src: custom_checkout.theme === "light" ? VisaIcon : VisaIconDark,
    alt: "Visa icon",
  },
  {
    src:
      custom_checkout.theme === "light" ? MastercardIcon : MastercardIconDark,
    alt: "Mastercard icon",
  },
  {
    src: custom_checkout.theme === "light" ? HipercardIcon : HipercardIconDark,
    alt: "Hipercard-v2 icon",
  },
  {
    src: custom_checkout.theme === "light" ? DinersIcon : DinersIconDark,
    alt: "Diners icon",
  },
  {
    src: custom_checkout.theme === "light" ? EloIcon : EloIconDark,
    alt: "Elo icon",
  },
  {
    src:
      custom_checkout.theme === "light"
        ? BoletoBarcodeIcon
        : BoletoBarcodeIconDark,
    alt: "Boleto barcode icon",
  },
];

const actual_year = computed(() => new Date().getFullYear());
</script>

<template>
  <footer
    class="flex min-h-[45px] w-screen flex-col items-center justify-center gap-5 p-4"
  >
    <section
      class="flex w-full flex-wrap items-center justify-center gap-5 px-10"
    >
      <p
        class="text-txt-color relative flex flex-nowrap text-[10px] font-normal"
      >
        {{ $t("components.footer.annual_fee") }}
      </p>
      <span class="flex flex-wrap items-center justify-center gap-5">
        <img
          v-for="(img, index) in imgs"
          :src="img.src"
          :alt="img.alt"
          :key="index"
          class="footer-icons"
          width="90"
          height="30"
        />
      </span>
    </section>
    <p class="text-txt-color text-[10px] font-normal">
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
