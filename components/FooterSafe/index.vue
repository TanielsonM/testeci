<script setup>
import safe_lock from "@/assets/footer/safe/safe_lock.svg";
import safe_product from "@/assets/footer/safe/safe_product.svg";
import safe_data from "@/assets/footer/safe/safe_data.svg";

const { t } = useI18n();

const items = computed(() => {
  return [
    {
      image: safe_lock,
      label: t("footer.safe.first.label"),
      emphasis: t("footer.safe.first.emphasis"),
    },
    {
      image: safe_product,
      label: t("footer.safe.second.label"),
      emphasis: t("footer.safe.second.emphasis"),
    },
    {
      image: safe_data,
      label: t("footer.safe.third.label"),
      emphasis: t("footer.safe.third.emphasis"),
    },
  ];
});
</script>

<template>
  <section class="w-full flex justify-around">
    <span
      class="flex flex-col items-center"
      v-for="(item, index) in items"
      :key="index"
      :class="`item-${index + 1}`"
    >
      <img
        :src="item.image"
        :alt="`icon safe ${index + 1}`"
        width="25"
        height="34"
        class="w-[25px] h-[34px] mb-2"
      />
      <p class="text-[11px] text-txt-color">{{ item.label }}</p>
      <p class="text-[13px] font-semibold emphasis">{{ item.emphasis }}</p>
    </span>
  </section>
</template>

<style lang="scss" scoped>
.item-1 {
  .emphasis {
    color: #00e4a0;
  }
}
.item-2 {
  .emphasis {
    color: #3483fa;
  }
}
.item-3 {
  img {
    filter: invert(1);
  }
  .emphasis {
    color: #81858e;
  }
}

[data-theme="light"] {
  .item-3 {
    img {
      filter: none;
      opacity: 1;
    }
  }
}
</style>