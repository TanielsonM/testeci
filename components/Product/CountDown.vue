<script setup>
import moment from "moment";
import { useCheckoutStore } from "@/store/checkout"
const checkout = useCheckoutStore();
const props = defineProps({
  coupon: {
    type: Object,
    required: true,
    default: () => {},
  },
});

const time = ref({
  hours: 0,
  minutes: 0,
  seconds: 0,
});

function setTime() {
  const today = moment().format("X");
  const due_date = moment(props.coupon.due_date).format("X");
  const diff = moment.duration(due_date - today, "seconds");
  time.value.hours =
    diff.days() > 0 ? diff.days() * 24 + diff.hours() : `0${diff.hours()}`;
  time.value.minutes =
    diff.minutes() < 10 ? `0${diff.minutes()}` : diff.minutes();
  time.value.seconds =
    diff.seconds() < 10 ? `0${diff.seconds()}` : diff.seconds();
}
setTime();
const interval = setInterval(() => {
  setTime();
}, 1000);

watch(
  () => time.value.seconds,
  (value) => {
    if (
      parseInt(time.value.hours) === 0 &&
      parseInt(time.value.minutes) === 0 &&
      parseInt(time.value.seconds) === 0
    ) {
      window.clearInterval(interval);
      checkout.setCoupon(false, true)
    }
  }
);
</script>

<template>
  <BaseBadge variant="success">
    <section class="flex gap-1">
      {{ $t("components.coupon.coupon_expires") }}
      <span class="flex gap-1">
        {{ time.hours }}h
        <span>:</span>
        {{ time.minutes }}m
        <span>:</span>
        {{ time.seconds }}s
      </span>
    </section>
  </BaseBadge>
</template>