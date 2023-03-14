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
    <section
      v-if="isOpen && !coupon.applied"
      class="w-full flex flex-col gap-5"
    >
      <BaseInput
        :placeholder="$t('components.coupon.input_placeholder')"
        v-model="coupon.name"
        animation="top"
        :disabled="!!hasCoupon && checkout.coupon.applied"
        custom-class="uppercase"
        :error="coupon.error ? $t('checkout.cupom.invalido') : ''"
      />
      <BaseButton
        color="info"
        :disabled="!coupon.name.length"
        :loading="coupon.loading"
        animation="top"
        @click="apply"
      >
        <p class="font-semibold text-sm">{{ $t("components.coupon.apply") }}</p>
      </BaseButton>
    </section>
    <section
      v-else-if="isOpen"
      class="flex flex-col items-start justify-start w-full gap-2"
    >
      <p class="text-txt-color text-xs">
        {{ $t("checkout.cupom.cupom") }}
        <span class="font-bold">{{ coupon.name.toUpperCase() }}</span>
        {{ $t("checkout.cupom.aplicado") }}
      </p>
      <a
        class="hover:underline text-blue-600 text-[13px] cursor-pointer"
        @click.prevent="checkout.setCoupon(false, true)"
        >{{ $t("checkout.cupom.remover") }}</a
      >
      <BaseBadge variant="success" v-if="coupon.available">
        {{
          coupon.available > 10
            ? `${$t("checkout.cupom.restam")} ${coupon.available} ${$t(
                "checkout.cupom.disponiveis"
              )}`
            : `${$t("checkout.cupom.acabando")} ${$t(
                "checkout.cupom.restam"
              )} ${coupon.available} ${$t("checkout.cupom.disponiveis")}`
        }}
      </BaseBadge>
      <section class="w-full" v-if="coupon.due_date">
        <span class="text-txt-color text-[13px]">{{
          $t("components.coupon.coupon_due_date")
        }}</span>
        <ProductCountDown :coupon="coupon" />
      </section>
    </section>
  </section>
</template>

<style lang="scss" scoped>
</style>