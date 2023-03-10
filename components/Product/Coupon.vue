<script setup>
import { storeToRefs } from "pinia";
import { useCheckoutStore } from "@/store/checkout";
const checkout = useCheckoutStore();
const { coupon, hasCoupon } = storeToRefs(checkout);

const isOpen = ref(!!coupon.value.name);

function apply() {
  checkout.setCoupon();
}
</script>

<template>
  <section
    class="w-full border border-bd-color rounded p-5 flex flex-col items-center gap-5 item-collapse"
    :opened="isOpen"
  >
    <span
      class="w-full flex flex-nowrap gap-2 items-center justify-start"
      @click="isOpen = !isOpen"
    >
      <Icon name="carbon:ticket" size="28" class="text-blue-600" />
      <p class="font-semibold text-[13px] text-txt-color w-full">
        {{ $t("components.coupon.add") }}
      </p>
      <Icon
        name="ic:baseline-arrow-drop-down"
        size="22"
        class="text-gray-400 duration-500"
        :class="{ 'rotate-180': isOpen }"
      />
    </span>
    <section v-if="isOpen && !coupon.applied" class="w-full flex flex-col gap-5">
      <BaseInput
        :placeholder="$t('components.coupon.input_placeholder')"
        v-model="coupon.name"
        animation="top"
        :disabled="!!hasCoupon"
        custom-class="uppercase"
        :error="coupon.error ? $t('checkout.cupom.invalido') : ''"
      />
      <BaseButton
        :disabled="!coupon.name.length"
        :loading="coupon.loading"
        animation="top"
        @click="apply"
      >
        <p class="font-semibold text-sm">{{ $t("components.coupon.apply") }}</p>
      </BaseButton>
    </section>
    <section v-else-if="isOpen">
      <h1>teste</h1>
    </section>
  </section>
</template>

<style lang="scss" scoped>
</style>