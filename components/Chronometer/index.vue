<script setup>
const props = defineProps({
  tempoEmSegundos: {
    type: Number,
    required: true,
    default: 0
  }
});

const tempoDecorrido = computed(() => {
  return new Date(props.tempoEmSegundos * 1000)
    .toISOString()
    .substr(14, 5)
});
</script>

<template>
  <section class="flex items-center min-w-[100px] mr-4 text-[#3483FA]">
    <div class="w-full">
      <p class="text-[16px] font-[600] leading-[24px] mt-[3px]">
        Finalize em até {{ tempoDecorrido }}
      </p>
    </div>
  </section>
</template>