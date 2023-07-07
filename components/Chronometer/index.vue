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
    .substr(11, 8)
});
</script>

<template>
  <section class="min-w-[100px] mr-4">
    <Icon name="mdi:clock" class="mr-1" size="20" />
    {{ tempoDecorrido }}
  </section>
</template>