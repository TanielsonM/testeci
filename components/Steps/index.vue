<script setup>
defineProps({
  title: String,
  step: [Number, String]
})
</script>

<template>
  <section class="w-full flex justify-between items-center pb-3 border-b border-[#e4e4ec]">
    <span class="flex items-center gap-5 text-base font-semibold text-black flex-nowrap">
      <p class="text-main-color text-2xl ">
        {{ step }}
      </p>
      <p class="flex-nowrap text-txt-color">
        {{ title }}
      </p>
    </span>
    <slot name="end-line" />
  </section>
</template>