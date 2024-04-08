<script setup>
import { useCustomCheckoutStore } from "~~/store/customCheckout";
const custom_checkout = useCustomCheckoutStore();
</script>

<template>
  <header
    v-if="custom_checkout.hasScarcity"
    class="sticky top-0 z-50 flex min-h-[60px] w-full items-center justify-center px-5 py-[20px] shadow-lg"
    :style="{ backgroundColor: custom_checkout.scarcity.background }"
  >
    <section
      class="flex h-full w-full max-w-[1250px] flex-wrap items-center justify-between gap-5 scarcity"
    >
      <section class="flex items-center gap-5">
        <span class="hidden md:block">
          <Icon name="mdi:clock-time-four" size="48" class="text-white" />
        </span>
        <span>
          <h5 class="font-semibold text-white md:text-xl">
            {{ custom_checkout.scarcity.title }}
          </h5>
          <p class="text-xs text-white md:text-sm">
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

<style lang="scss">
@media(max-width:768px) {
  .scarcity{
    display: grid !important;
    grid-template-columns: 1fr !important;
    justify-items: start !important;
  }
}
</style>
