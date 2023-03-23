<script setup>
const props = defineProps({
  label: {
    type: String,
    required: true,
    default: () => "",
  },
});
</script>

<template>
  <section class="flex flex-col items-start">
    <label class="text-txt-color mb-1 text-[10px] opacity-70">
      <slot name="label">
        {{ label }}
      </slot>
    </label>
    <section class="flex items-center">
      <slot />
    </section>
  </section>
</template>