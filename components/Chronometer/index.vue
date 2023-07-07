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
  <section class="flex justify-between items-center min-w-[100px] mr-4 text-input-color">
    <Icon name="mdi:clock" class="mr-1 min-w-[20px]" size="20" />
    <div class="w-full flex justify-center">
      <p class="text-[18px] font-[700] mt-[3px]">{{ tempoDecorrido }}</p>
    </div>
  </section>
</template>