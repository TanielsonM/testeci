<script setup>
import { storeToRefs } from "pinia";
import { useProductStore } from "~~/stores/product";

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
const secondText = computed(() => {
  if (seconds.value < 10) {
    return `0${seconds.value}`;
  }
  return seconds.value;
});

const intervalSeconds = setInterval(() => {
  seconds.value = seconds.value - 1;
}, 1000);

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
    if (value <= 0 && minutes.value) {
      seconds.value = 59;
      minutes.value = minutes.value - 1;
    }
    if (value <= 0 && minutes.value <= 0) {
      window.clearInterval(intervalSeconds);
      seconds.value = 0;
    }
  }
);

watch(
  () => minutes.value,
  (value) => {
    if (!value) {
      clearInterval(intervalSeconds);
      seconds.value = 0;
    }
  }
);
</script>

<template>
  <section
    class="
      countdown
      px-2
      py-1
      md:px-5 md:py-[10px]
      rounded-md
      flex
      items-center
      gap-1
    "
  >
    <span class="text-white font-semibold md:text-xl">00h :</span>
    <span class="text-white font-semibold md:text-xl"
      >{{ minutesText }}m :</span
    >
    <span class="text-white font-semibold md:text-xl">{{ secondText }}s</span>
  </section>
</template>

<style lang="scss" scoped>
.countdown {
  background: rgba(255, 255, 255, 0.2);
}
</style>