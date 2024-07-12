<script setup>
import { storeToRefs } from "pinia";
import { useProductStore } from "~~/store/product";
const { product_id } = useProductStore();
const cookie = useCookie(`time_scarcity-${product_id}`);
const props = defineProps({
  time: {
    type: [String, Number],
    required: true,
    default: () => 0,
  },
  color: {
    type: String,
    required: false,
    default: () => "",
  },
});
const date = new Date();
date.setMinutes(parseInt(props.time));
let minutes = cookie.value
  ? ref(cookie.value.minutes)
  : ref(date.getMinutes() - 1);
let seconds = cookie.value ? ref(cookie.value.seconds) : ref(59);

const minutesText = computed(() => {
  if (minutes.value < 10) {
    return `0${minutes.value}`;
  }
  return minutes.value;
});
const secondsText = computed(() => {
  if (seconds.value < 10) {
    return `0${seconds.value}`;
  }
  return seconds.value;
});

let intervalSeconds;

if (process.client) {
  intervalSeconds = setInterval(() => {
    seconds.value = seconds.value - 1;
  }, 1000);
}

function saveTime() {
  cookie.value = JSON.stringify({
    minutes: minutes.value,
    seconds: seconds.value,
  });
}

watch(
  () => seconds.value,
  (value) => {
    saveTime();
    if (value <= 0 && minutes.value > 0) {
      seconds.value = 59;
      minutes.value = minutes.value - 1;
    } else if (value <= 0 && minutes.value <= 0) {
      clearInterval(intervalSeconds);
      seconds.value = 0;
      minutes.value = 0;
    }
  }
);

watch(
  () => minutes.value,
  (value) => {
    if (value <= 0) {
      clearInterval(intervalSeconds);
      minutes.value = 0;
      seconds.value = 0;
    }
  }
);
</script>

<template>
  <ClientOnly>
    <section
      class="countdown flex items-center gap-1 rounded-md px-2 py-1 md:px-5 md:py-[10px]"
    >
      <span class="font-semibold text-white md:text-xl">00h :</span>
      <span class="font-semibold text-white md:text-xl"
        >{{ minutesText }}m :</span
      >
      <span translate="no" class="font-semibold text-white md:text-xl">{{ secondsText }}s</span>
    </section>
  </ClientOnly>
</template>

<style lang="scss" scoped>
.countdown {
  background: rgba(255, 255, 255, 0.2);
}
@media (max-width: 768px) {
  .countdown {
    width: 100% !important;
  }
}
@media (max-width: 350px) {
  .countdown {
    width: initial !important;
  }
}
</style>
