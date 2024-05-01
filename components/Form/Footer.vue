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
import { useProductStore } from "@/store/product";

const product = useProductStore();
const { cashback } = storeToRefs(product);
const hasCashback = cashback.value.meta && cashback.value.months;

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
</script>
<template>
  <section
    class="flex w-full flex-wrap items-center justify-center gap-5 md:justify-between"
  >
    <p
      class="relative hidden flex-nowrap text-[10px] font-normal text-txt-color md:flex"
    >
      {{ $t("components.footer.annual_fee") }}
    </p>
    <span class="flex flex-wrap items-center justify-between">
      <img
        v-for="(img, index) in imgs"
        :src="img.src"
        :alt="img.alt"
        :key="index"
        class="footer-icons max-h-[40px] max-w-[90px]"
      />
    </span>
  </section>
  <section v-if="hasCashback" class="md:justify-between">
    <p class="text-[12px] font-normal text-txt-color md:flex">
      {{ $t("checkout.termos_de_uso_texto") }}
    </p>
  </section>
</template>
