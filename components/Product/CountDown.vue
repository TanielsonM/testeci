<script setup>
import moment from "moment";
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
setInterval(() => {
  setTime();
}, 1000);
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