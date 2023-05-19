<script setup>
const actual_year = computed(() => new Date().getFullYear());
</script>

<template>
  <footer
    class="flex min-h-[45px] w-full flex-col items-start md:items-center justify-center gap-5 p-4"
  >
    <p
      class="relative flex flex-nowrap text-[10px] font-normal text-txt-color md:hidden"
    >
      {{ $t("components.footer.annual_fee") }}
    </p>
    <p class="text-[10px] font-normal text-txt-color">
      Greenn © {{ actual_year }} - {{ $t("components.footer.reverved_text") }}
    </p>
  </footer>
</template>

<style lang="scss" scoped>
.footer-icons {
  filter: grayscale(100%);
  opacity: 0.3;
  width: 60px;
  height: 40px;

  &:first-child {
    width: 80px;
    height: 40px;
    object-fit: contain;
  }
}

[data-theme="dark"] {
  .footer-icons {
    opacity: 0.7;
  }
}
</style>
