<script setup>
const { t } = useI18n();

const items = ref([
  {
    icon: "fa6-solid:bolt",
    size: "27",
    title: t("checkout.pagamento.metodos.pix.pix_info1.titulo"),
    text: t("checkout.pagamento.metodos.pix.pix_info1.texto"),
  },
  {
    icon: "tabler:rectangle-vertical-filled",
    size: "27",
    title: t("checkout.pagamento.metodos.pix.pix_info2.titulo"),
    text: t("checkout.pagamento.metodos.pix.pix_info2.texto"),
  },
  {
    icon: "bi:shield-fill",
    size: "27",
    title: t("checkout.pagamento.metodos.pix.pix_info3.titulo"),
    text: t("checkout.pagamento.metodos.pix.pix_info3.texto"),
  },
]);
</script>

<template>
  <section class="mb-10 grid w-full grid-flow-row gap-10 md:grid-flow-col">
    <section
      class="flex flex-col items-start justify-start gap-3"
      v-for="(item, index) in items"
      :key="index"
    >
      <Icon
        :name="item.icon"
        class="h-[31px] text-main-color"
        :size="item.size"
      />
      <h4 class="text-sm font-semibold text-txt-color">{{ item.title }}</h4>
      <p class="text-[13px] font-normal text-txt-color">{{ item.text }}</p>
    </section>
  </section>
</template>
