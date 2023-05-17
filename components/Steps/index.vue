<script setup>
import { useStepStore } from "~~/store/modules/steps";

const stepStore = useStepStore();

defineProps({
  title: String,
  step: {
    type: [Number, String, Boolean],
    default: () => false,
  },
  icon: {
    type: [String, Boolean],
    default: () => false,
  },
});
</script>

<template>
  <section
    class="flex w-full items-center justify-between border-b border-[#e4e4ec] pb-3"
  >
    <span
      class="flex flex-nowrap items-center gap-5 text-base font-semibold text-black"
    >
      <p class="text-2xl text-main-color" v-if="step">
        {{ step }}
      </p>
      <p class="text-2xl text-main-color" v-if="icon">
        <Icon :name="icon" />
      </p>
      <p class="flex-nowrap text-input-color">
        {{ title }}
      </p>
    </span>
    <slot name="end-line" />
  </section>
  <section class="w-full flex-col">
    <slot name="content" />
  </section>
</template>
