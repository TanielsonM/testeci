<script setup>
const route = useRoute();
const cronometroRodando = ref(false);
const tempoEmSegundos = ref(600);
let cronometro = null;

function start() {
  if (!cronometroRodando.value) {
    cronometroRodando.value = true
    cronometro = setInterval(() => {
      tempoEmSegundos.value -= 1
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

watch(cronometroRodando, (newValue) => {
  if (!newValue) {
    finish();
  }
});

watch(tempoEmSegundos, (newValue) => {
  if(newValue === 0) {
    finish()
    if(route.name === 'pre-checkout-product_id') {
      window.location.reload(true)
    } else {
      navigateTo(`/pre-checkout/${route.params?.product_id}`)
    }
  }
})

onMounted(() => {
  start();
})
</script>

<template>
  <section class="flex items-center justify-between rounded-b p-4 bg-gray-200">
    <Chronometer :tempoEmSegundos="tempoEmSegundos"/>
    <span class="text-sm">
      Após este tempo, os ingressos serão liberados para venda novamente.
    </span>
  </section>
</template>