<script setup>
import { storeToRefs } from "pinia";
import { useCustomCheckoutStore } from "~~/store/customCheckout";
import { useProductStore } from "~~/store/product";
import { useStepStore } from "~~/store/modules/steps";
import greenn from "../../assets/logos/logo.png";
import heaven from "../../assets/heaven/logo.svg";

const customCheckStore = useCustomCheckoutStore();
const product = useProductStore();
const stepStore = useStepStore();

const { topThumb, hasScarcity, hasCustomLogo, isOneStep } =
  storeToRefs(customCheckStore);
const { countSteps, currentStep, isMobile } = storeToRefs(stepStore);
</script>

<template>
  <Scarcity v-if="product.isValid() && hasScarcity" />
  <header
    v-if="topThumb && product.isValid()"
    class="flex max-h-[40vh] w-full max-w-[1250px] items-center justify-center overflow-hidden rounded-lg object-contain"
    :class="{ '-mt-10': hasScarcity }"
  >
    <img :src="topThumb" alt="Thumb superior" class="rounded-lg" />
  </header>
  <header
    v-if="!hasScarcity && !topThumb && product.isValid()"
    class="header sticky top-0 z-50 flex min-h-[60px] w-full items-center justify-between bg-checkout px-4"
  >
    <a href="https://greenn.com.br/" target="_blank">
      <img
        :src="hasCustomLogo ? hasCustomLogo : greenn"
        alt="Logo da pagina"
        class="max-h-10 max-w-[100px] object-contain"
        width="100"
        height="40"
      />
    </a>
    <div class="steps flex" v-if="isMobile && !isOneStep">
      <div
        class="mx-1 h-2 w-2 rounded-full"
        :class="{
          'bg-main-color': item == currentStep,
          'bg-main-transparent-color': item != currentStep,
        }"
        v-for="item in countSteps"
        :key="item"
      ></div>
    </div>
  </header>
</template>
<style lang="scss" scoped>
.header {
  box-shadow: 2px 6px 10px rgba(0, 0, 0, 0.05);
}
</style>
