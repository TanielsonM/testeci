<script setup>
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
      <p class="text-main-color text-2xl" v-if="step">
        {{ step }}
      </p>
      <p class="text-main-color text-2xl" v-if="icon">
        <Icon :name="icon" />
      </p>
      <p class="text-txt-color flex-nowrap">
        {{ title }}
      </p>
    </span>
    <slot name="end-line" />
  </section>
  <section class="w-full flex-col">
    <slot name="content" />
  </section>
</template>
