<script setup>
import * as Toast from "vue-toastification";
import { storeToRefs } from "pinia";
import { useCheckoutStore } from "@/store/checkout";
import { useProductStore } from "@/store/product";
import { usePaymentStore } from "~~/store/modules/payment";

const payment = usePaymentStore();
const checkout = useCheckoutStore();
const product = useProductStore();
const { coupon, hasCoupon } = storeToRefs(checkout);
const { productName } = storeToRefs(product);

const { t } = useI18n();
const isOpen = ref(!!coupon.value.name);

function apply() {
  payment.setPaymentLoading(true);

  checkout.setCoupon().then(() => {
    /* Show toast */
    if (coupon.value.applied) {
      const toast = Toast.useToast();
      toast.info(
        `${t("checkout.cupom.header_aplicado")}${t(
          "checkout.cupom.no_produto"
        )}: ${productName.value.toUpperCase()}`
      );
    }
  }).finally(() => {
    payment.setPaymentLoading(false);
  });
}
</script>

<template>
  <section
    class="item-collapse flex w-full flex-col items-center gap-5 rounded border border-bd-color p-5"
    :opened="isOpen"
  >
    <span
      class="flex w-full flex-nowrap items-center justify-start gap-2"
      @click="isOpen = !isOpen"
    >
      <Icon name="carbon:ticket" size="28" class="text-blue-600" />
      <p class="w-full text-[13px] font-semibold text-txt-color">
        {{
          coupon.applied
            ? $t("checkout.cupom.header_aplicado")
            : $t("checkout.cupom.header_add")
        }}
      </p>
      <Icon
        name="ic:baseline-arrow-drop-down"
        size="22"
        class="text-gray-400 duration-500"
        :class="{ 'rotate-180': isOpen }"
      />
    </span>
    <!-- Abre e nao tem cupom aplicado -->
    <section
      v-if="isOpen && !coupon.applied"
      class="flex w-full flex-col gap-5"
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
        <p class="text-sm font-semibold">{{ $t("components.coupon.apply") }}</p>
      </BaseButton>
    </section>
    <!-- Abre e tem cupom aplicado e nao pode remover pois esta renovando uma assinatura -->
    <!-- <section
      v-else-if="isOpen && coupon.applied && urlSubscription"
      class="flex w-full flex-col items-start justify-start gap-2"
    >
      <p class="text-xs text-txt-color">
        {{ $t("checkout.cupom.cupom") }}
        <span class="font-bold">{{ coupon.name.toUpperCase() }}</span>
        {{ $t("checkout.cupom.aplicado") }}
      </p>
      <a
        class="cursor-pointer text-[13px] text-blue-600 hover:underline"
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
        <span class="text-[13px] text-txt-color">{{
          $t("components.coupon.coupon_due_date")
        }}</span>
        <ProductCountDown :coupon="coupon" />
      </section>
    </section> -->
    <!-- Abre e tem cupom aplicado e pode remover -->
    <section
      v-else
      class="flex w-full flex-col items-start justify-start gap-2"
    >
      <p class="text-xs text-txt-color">
        {{ $t("checkout.cupom.cupom") }}
        <span class="font-bold">{{ coupon.name.toUpperCase() }}</span>
        {{ $t("checkout.cupom.aplicado") }}
      </p>
      <a
        class="cursor-pointer text-[13px] text-blue-600 hover:underline"
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
        <span class="text-[13px] text-txt-color">{{
          $t("components.coupon.coupon_due_date")
        }}</span>
        <ProductCountDown :coupon="coupon" />
      </section>
    </section>
  </section>
</template>

<style lang="scss" scoped></style>
