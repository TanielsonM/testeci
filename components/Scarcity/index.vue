<script setup>
import { useCustomCheckoutStore } from "~~/stores/customCheckout";
const custom_checkout = useCustomCheckoutStore();
</script>

<template>
  <header
    v-if="custom_checkout.hasScarcity"
    class="
      w-screen
      min-h-[60px]
      shadow-lg
      flex
      items-center
      justify-center
      px-5
      sticky
      top-0
      py-[20px]
      z-50
    "
    :style="{ backgroundColor: custom_checkout.scarcity.background }"
  >
    <section
      class="
        w-full
        h-full
        max-w-[1250px]
        flex
        gap-5
        items-center
        justify-between
        flex-wrap
      "
    >
      <section class="flex items-center gap-5">
        <span class="hidden md:block">
          <Icon name="mdi:clock-time-four" size="48" class="text-white" />
        </span>
        <span>
          <h5 class="md:text-xl font-semibold text-white">
            {{ custom_checkout.scarcity.title }}
          </h5>
          <p class="text-xs md:text-sm text-white">
            {{ custom_checkout.scarcity.subtitle }}
          </p>
        </span>
      </section>
      <ScarcityCountdown
        :time="custom_checkout.scarcity.time"
        :color="custom_checkout.scarcity.background"
      />
    </section>
  </header>
</template>