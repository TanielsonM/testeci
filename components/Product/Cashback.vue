<script setup>
import { formatMoney } from "~~/utils/money";
import { storeToRefs } from "pinia";
import { useProductStore } from "@/store/product";
import money_cashback from "@/assets/icons/money_cashback.svg";
import target_cashback from "@/assets/icons/target_cashback.svg";

const product = useProductStore();
const { cashback } = storeToRefs(product);
const hasCashback = Object.keys(cashback || {}).length;

const { t } = useI18n();

</script>

<template>
  <section v-if="hasCashback" class="mt-2">
    <section
      class="cashback-item flex w-full flex-col items-center gap-5 rounded border border-bd-color p-5 mb-3"
    > 
      <span class="badge-cashback">💰 Cashback</span>
      <span
        class="pl-1 flex w-full flex-nowrap items-center justify-start gap-2"
      >
        <img
          :src="money_cashback"
          alt="icon money cashback"
          class="mr-[20px]"
        />
        <div class="w-full flex-col">
          <p class="w-full text-[14px] font-bold text-[#009488]">
            {{ $t("checkout.with_cashback") }}
          </p>
          <p class="w-full text-[11px] text-[#009488]">
            {{ $t("checkout.sponsored_by_greenn") }}
          </p>
        </div>
      </span>
    </section>

    <section
      class="cashback-target flex w-full flex-col items-center gap-5 rounded border border-bd-color p-5"
    >
      <span
        class="flex w-full flex-nowrap items-center justify-start gap-2"
      >
        <img
          :src="target_cashback"
          alt="icon money cashback target"
          class="mr-[20px]"
        />
        <p class="w-full text-[14px] text-[#000]">
          {{ $t("checkout.sell") }} 
          {{ formatMoney(cashback.meta) }} 
          {{ $t("checkout.in") }} 
          {{ cashback.months }} 
          {{ cashback.months === 1 ? $t("checkout.month") : $t("checkout.months") }} 
          {{ $t("checkout.to_get_cashbash") }} 
        </p>
      </span>
    </section>

  </section>
</template>

<style lang="scss" scoped>
.cashback-item {
  background-color: rgba(0, 148, 136, 0.1);
  color: #009488;
}
.badge-cashback {
  position: absolute;
  margin-top: -35px;
  margin-right: -240px;
  background: #000000;
  border-radius: 5px;
  color: #fff;
  padding: 11px;
  padding-top: 6px;
  padding-bottom: 5px;
  font-size: 12px;
  font-weight: 600;
  line-height: 15px;
  letter-spacing: 0em;
  text-align: left;
}
.cashback-target {
  background-color: #F7F7F7;
;
}
</style>
