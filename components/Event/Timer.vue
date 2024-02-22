<script setup>
import { useExpiredSessionStore } from "~~/store/modal/expiredSession";

const expiredSession = useExpiredSessionStore();
const cronometroRodando = ref(false);
const tempoEmSegundos = ref(600);
let cronometro = null;

function start() {
  if (!cronometroRodando.value) {
    cronometroRodando.value = true;
    cronometro = setInterval(() => {
      tempoEmSegundos.value -= 1;
    }, 1000);
  }
}

function finish(evt) {
  if (cronometroRodando.value) {
    tempoEmSegundos.value = 0;
    cronometroRodando.value = false;
    clearInterval(cronometro);
    cronometro = null;
    if(evt !== 'onBeforeUnmount'){
      expiredSession.setHaveFinished(true);
    }
  }
}

onBeforeUnmount(() => {
  if(cronometro) {
    finish('onBeforeUnmount');
  }
});

watch(cronometroRodando, (newValue) => {
  if (!newValue && cronometro) {
    finish();
  }
});

watch(tempoEmSegundos, (newValue) => {
  if(newValue === 0 && cronometro) {
    finish();
  }
})

onMounted(() => {
  expiredSession.setHaveFinished(false);
  start();
})
</script>

<template>
  <section class="rounded-b p-4 section-color">
    <Chronometer :tempoEmSegundos="tempoEmSegundos"/>
    <span class="text-[14px] font-[400] leading-[21px] text-[#3483FA]">
      {{ $t("checkout.event.finish_time_text") }}
    </span>
  </section>
</template>

<style scoped>
.section-color {
  background: rgba(52, 131, 250, 0.10);
}
</style>