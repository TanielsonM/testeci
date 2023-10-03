<script setup>
import { storeToRefs } from "pinia";
import { useLoadingStore } from "~~/store/loading/loading";
import { useCheckoutStore } from "@/store/checkout";

const loading = useLoadingStore();
const checkout = useCheckoutStore();

const { isLoading, current } = storeToRefs(loading);
const { product_id } = storeToRefs(checkout);

const props = defineProps({
  options: {
    required: true,
  },
  isBump: {
    type: Boolean,
    default: false,
  },
  bump: {
    type: Number,
  },
});
const isActive = ref(0);

const selectOption = (index, amount, shipping) => {
  isActive.value = index;
  checkout.setSelectedShipping(
    props.isBump ? props.bump : product_id.value,
    shipping
  );
};

watch(
  () => props.options,
  (val) => {
    if (props.options.length) {
      selectOption(0, props.options[0]?.price || 0, props.options[0]);
    }
  }
);
</script>

<template>
  <div v-if="isLoading && current.includes('envios/calculate/')">
    <LoadingShimmer width="30%" height="30px" />
    <LoadingShimmer height="50px" :quantity="4" />
  </div>
  <p
    class="flex-nowrap py-3 font-semibold text-txt-color"
    v-if="!!options.find((option) => option.price > 0)"
  >
    {{ $t("checkout.address.select_shipping") }}
  </p>
  <div
    v-for="(option, index) in options.filter((option) => !option?.error)"
    :key="index"
    class="item frete"
    :class="{ selected: isActive == index }"
    @click="selectOption(index, option?.price, option)"
  >
    <div class="grid grid-cols-12 items-center gap-3" v-if="option.price">
      <div class="col-span-3">
        <img :src="option.company.picture" width="80" />
      </div>
      <div class="col-span-3">
        {{ option.name }}
      </div>
      <div class="col-span-3">
        {{ option.delivery_range.min }}
        {{ $t("checkout.address.at") }}
        {{ option.delivery_range.max }}
        {{ $t("checkout.address.working_days") }}
      </div>
      <div class="price col-span-3">
        {{ formatMoney(option.price) }}
      </div>
    </div>
  </div>
</template>
<style lang="scss">
.frete {
  background: #f7f7f7;
  border-radius: 5px;
  padding: 15px;
  margin-bottom: 0.5rem;
  box-sizing: border-box;
  cursor: pointer;

  &.selected {
    border: 2px solid var(--main-color);
  }

  div {
    font-size: 0.93rem;

    &.price {
      color: var(--main-color);
      font-weight: 600;
      text-align: right;
    }
  }
}
</style>
