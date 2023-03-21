<script setup>
const props = defineProps({
  variant: {
    type: String,
    required: false,
    default: () => "primary",
    validator: (value) =>
      ["primary", "danger", "warning", "success"].includes(value),
  },
});

const style = computed(() => {
  switch (props.variant) {
    case "primary":
      return { bg: "bg-blue-100", text: "text-blue-600" };
    case "danger":
      return { bg: "bg-red-300", text: "text-red-600" };
    case "warning":
      return { bg: "bg-orange-300", text: "text-orange-600" };
    case "success":
      return { bg: "bg-green-200", text: "text-green-600" };
  }
});
</script>

<template>
  <section
    :class="[variant]"
    class="flex-wrap rounded px-[15px] py-[10px] text-left text-[75%] font-semibold"
  >
    <slot></slot>
  </section>
</template>

<style lang="scss" scoped>
.primary {
  background-color: rgba(65, 137, 230, 0.15);
  color: #3483fa;
}
.success {
  background-color: var(--transparent);
  color: var(--main-color);
}
</style>
