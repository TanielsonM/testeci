<script setup>
import { useCustomCheckoutStore } from "~~/store/customCheckout";
import { useProductStore } from "~~/store/product";
import { useStepStore } from "~~/store/modules/steps";
import greenn from "../../assets/logos/logo.png";
import heaven from "../../assets/heaven/logo.svg";

const customCheckStore = useCustomCheckoutStore();
const product = useProductStore();
const stepStore = useStepStore();

const { topThumb, hasScarcity, hasCustomLogo } = storeToRefs(customCheckStore);
const { countSteps, currentStep, isMobile } = storeToRefs(stepStore);

const items = computed(() => {
  return Array.from({ length: countSteps.value / 2 }, (_, index) => index);
});
</script>

<template>
  <section
    class="flex w-full flex-col items-center justify-center"
    v-if="product.isValid() && (topThumb || hasScarcity)"
  >
    <Scarcity v-if="product.isValid()" />
    <header
      v-if="topThumb && product.isValid()"
      class="flex max-h-[40vh] w-full max-w-[1250px] items-center justify-center object-contain"
    >
      <img :src="topThumb" alt="Thumb superior" />
    </header>
  </section>
  <header
    v-if="!hasScarcity && !topThumb && product.isValid()"
    class="header sticky top-0 z-50 flex min-h-[60px] w-full items-center justify-between bg-checkout px-4"
  >
    <img
      :src="hasCustomLogo ? hasCustomLogo : greenn"
      alt="Logo da pagina"
      class="max-h-10 max-w-[100px] object-contain"
      width="100"
      height="40"
    />
    <!-- <div class="steps flex" v-if="isMobile">
          <div
            class="mx-1 h-2 w-2 rounded-full"
            :class="{
              'bg-main-color': item <= currentStep,
              'bg-main-transparent-color': item > currentStep,
            }"
            v-for="item in items"
            :key="item"
          ></div>
        </div> -->
  </header>
</template>
<style lang="scss" scoped>
.header {
  box-shadow: 2px 6px 10px rgba(0, 0, 0, 0.05);
}
</style>
