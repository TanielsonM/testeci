<script lang="ts" setup>
import { ref, onMounted } from "vue";
import { useModalStore } from "~~/store/modal/success";

const { t } = useI18n();
const modal = useModalStore();

const props = defineProps({
  countdownDate: {
    type: String,
    required: true,
  },
});

const countdownTime = new Date(props.countdownDate).getTime() + 3600000;

const currentTime = ref(new Date().getTime());
const remainingTime = ref(countdownTime - currentTime.value);
const showCountdown = computed(() => remainingTime.value > 0);

function formatTime(time: number) {
  const hours = Math.floor(time / 3600000);
  const minutes = Math.floor((time % 3600000) / 60000);
  const seconds = Math.floor((time % 60000) / 1000);

  const formattedHours = hours < 10 ? `0${hours}` : hours;
  const formattedMinutes = minutes < 10 ? `0${minutes}` : minutes;
  const formattedSeconds = seconds < 10 ? `0${seconds}` : seconds;

  return `${formattedHours}:${formattedMinutes}:${formattedSeconds}`;
}

onMounted(() => {
  setInterval(() => {
    if (remainingTime.value > 0) {
      currentTime.value = new Date().getTime();
      remainingTime.value = countdownTime - currentTime.value;
    }

    if (remainingTime.value < 1) {
      modal.setTitle(t("pg_obrigado.pix.prazo_expirado"));
      modal.setExpiredPix(true);
    }
  }, 1000);
});
</script>

<template>
  <span class="timer" v-if="showCountdown">{{
    formatTime(remainingTime)
  }}</span>
</template>
