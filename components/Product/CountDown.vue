<script setup>
import moment from "moment";
import { useCheckoutStore } from "@/store/checkout";
import * as Toast from "vue-toastification";

onMounted(() => {
  if (process.client) {
    const checkout = useCheckoutStore();
    const toast = Toast.useToast();
    const { t } = useI18n();
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
    const interval = setInterval(() => {
      setTime();
    }, 1000);

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

    watch(
      () => time.value.seconds,
      () => {
        if (
          parseInt(time.value.hours) === 0 &&
          parseInt(time.value.minutes) === 0 &&
          parseInt(time.value.seconds) === 0
        ) {
          window.clearInterval(interval);
          checkout.setCoupon(false, true).then(() => {
            toast.warning("Cupom expirou");
          });
        }
      }
    );
  }
});
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
