<script setup>
const cronometroRodando = ref(false);
const tempoEmSegundos = ref(0);
let cronometro = null;

function start() {
  if (!cronometroRodando.value) {
    cronometroRodando.value = true
    cronometro = setInterval(() => {
      tempoEmSegundos.value += 1
    }, 1000)
  }
}

function finish() {
  if (cronometroRodando.value) {
    tempoEmSegundos.value = 0
    cronometroRodando.value = false
    clearInterval(cronometro)
  }
}

onBeforeUnmount(() => {
  finish();
});

watch(cronometroRodando, (novoValor) => {
  if (!novoValor) {
    finish();
  }
});

onMounted(() => {
  start();
})
</script>

<template>
  <section class="flex items-center justify-between rounded p-4 bg-gray-200">
    <Chronometer :tempoEmSegundos="tempoEmSegundos"/>
    <span class="text-sm">
      Após este tempo, os ingressos serão liberados para venda novamente.
    </span>
  </section>
</template>