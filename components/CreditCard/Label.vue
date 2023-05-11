<script setup>
const props = defineProps({
  label: {
    type: String,
    required: true,
    default: () => "",
  },
  isBack: {
    type: Boolean,
    required: false,
    default: () => false,
  },
});
</script>

<template>
  <section class="flex flex-col" :class="isBack ? 'items-end' : 'items-start'">
    <label v-if="!isBack" class="mb-1 text-[10px] text-txt-color opacity-70">
      <slot name="label">
        {{ label }}
      </slot>
    </label>

    <label
      v-if="isBack"
      class="mb-2 text-[15px] font-semibold text-txt-color opacity-100"
    >
      <slot name="label" class="text-right text-[10px]">
        {{ label }}
      </slot>
    </label>
    <section class="flex items-center">
      <slot />
    </section>
  </section>
</template>
