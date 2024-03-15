<template>
  <section class="rounded-b p-4 section-color">
    <Chronometer :tempoEmSegundos="tempoEmSegundos"/>
    <span class="text-[14px] font-[400] leading-[21px] text-[#3483FA]">
      {{ $t("checkout.event.finish_time_text") }}
    </span>
  </section>
</template>

<script setup>
import { useExpiredSessionStore } from "~~/store/modal/expiredSession";
import { ref, onBeforeUnmount, onMounted } from 'vue';

const expiredSession = useExpiredSessionStore();
const tempoEmSegundos = ref(600);

let worker;
let workerUrl;

onMounted(() => {
  if (process.client) {
    // Criando um Blob com o código do Web Worker
    const workerBlob = new Blob([`
      let tempoEmSegundos = 600;
      let cronometroRodando = false;
      let intervalId = null;

      function startCronometro() {
        cronometroRodando = true;
        intervalId = setInterval(() => {
          if (tempoEmSegundos === 0) {
            clearInterval(intervalId);
            self.postMessage('finish');
          } else {
            tempoEmSegundos--;
            self.postMessage(tempoEmSegundos);
          }
        }, 1000);
      }

      function stopCronometro() {
        cronometroRodando = false;
        clearInterval(intervalId);
      }

      self.onmessage = (e) => {
        if (e.data === 'start') {
          startCronometro();
        } else if (e.data === 'stop') {
          stopCronometro();
        }
      };
    `], { type: 'application/javascript' });

    // Criando uma URL a partir do Blob
    workerUrl = URL.createObjectURL(workerBlob);

    // Criando e configurando o Web Worker
    worker = new Worker(workerUrl);

    // Tratando as mensagens do Web Worker
    worker.onmessage = (e) => {
      if (typeof e.data === 'number') {
        tempoEmSegundos.value = e.data;
      } else if (e.data === 'finish') {
        expiredSession.setHaveFinished(true);
      }
    };

    // Iniciando o Web Worker
    worker.postMessage('start');

  }
  // Parando o Web Worker quando o componente é desmontado
  onBeforeUnmount(() => {
    worker.postMessage('stop');
    URL.revokeObjectURL(workerUrl);
  });
});
</script>


<style scoped>
.section-color {
  background: rgba(52, 131, 250, 0.10);
}
</style>
