<script setup>
// Stores
import { useCheckoutStore } from "@/store/checkout";
// Utils
import { formatMoney } from "~~/utils/money";

const checkout = useCheckoutStore();
</script>

<template>
  <section class="flex w-full flex-col gap-3 px-5">
    <!-- Shipping -->
    <p
      class="flex items-center gap-1 md:flex-col md:items-start"
      v-if="checkout.hasPhysicalProduct()"
    >
      <span class="infos-title">Frete</span>
      <span
        class="infos-content w-full flex justify-between items-center"
        v-for="(item, index) in checkout.shippingProducts()"
        :key="index"
      >
        <p>{{ item.name }}</p>
        <p>
          {{
            item?.shipping?.amount
              ? formatMoney(item.shipping.amount)
              : item?.shipping?.amount === 0
              ? $t("checkout.pagamento.bump.free")
              : $t("checkout.pagamento.bump.to_calculate")
          }}
        </p>
      </span>
    </p>
  </section>
</template>
