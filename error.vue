<script setup>
// Logos
import Greenn from "@/assets/logos/logo.png";
import Heaven from "@/assets/heaven/logo.svg";

import { useCheckoutStore } from "./store/checkout";

const error = useError();
const checkout = useCheckoutStore();
</script>

<template>
  <main class="flex h-screen w-screen flex-col items-center">
    <section
      class="flex h-[80px] w-full items-center justify-center bg-red-600"
    >
      <p class="text-base font-semibold text-white">{{ error.message }}</p>
    </section>
    <section class="flex h-full items-center justify-center">
      <img
        :src="checkout.isHeaven ? Heaven : Greenn"
        alt="Logo do greenn"
        width="150"
        height="50"
      />
    </section>
  </main>
</template>
