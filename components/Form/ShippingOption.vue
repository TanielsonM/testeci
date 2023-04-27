<script setup>
import { storeToRefs } from "pinia";
import { useCheckoutStore } from "~~/store/checkout";
import { useProductStore } from "~~/store/product";
import { useLoadingStore } from "~~/store/loading/loading";
const checkout = useCheckoutStore();
const loading = useLoadingStore();
const product = useProductStore();
const { isLoading } = storeToRefs(loading);

const isActive = ref(-1);

const selectOption = (index, amount) => {
  isActive.value = index;
  product.setProductShipping(amount);
};
</script>

<template>
  <div v-if="isLoading">
    <LoadingShimmer width="30%" height="30px" />
    <LoadingShimmer height="50px" :quantity="4" />
  </div>
  <p
    class="flex-nowrap py-3 font-semibold text-txt-color"
    v-if="!!checkout.deliveryOptions[0]?.price && !isLoading"
  >
    {{ $t("checkout.address.select_shipping") }}
  </p>
  <div
    class="item frete"
    :class="{ selected: isActive == index }"
    @click="selectOption(index, option?.price)"
    v-if="!!checkout.deliveryOptions[0]?.price && !isLoading"
    v-for="(option, index) in checkout.deliveryOptions.sort(
      (a, b) => parseFloat(a.price) - parseFloat(b.price)
    )"
  >
    <div class="grid grid-cols-12 items-center gap-3">
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
