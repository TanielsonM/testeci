<script setup>
const props = defineProps({
  disabled: {
    type: Boolean,
    default: false,
  },
  type: {
    type: String,
    default: "button",
  },
  color: {
    type: String,
    default: "primary",
  },
  size: {
    type: String,
    default: "md",
  },
  animation: {
    type: String,
    required: false,
    default: () => "bottom",
  },
  loading: {
    type: Boolean,
    required: false,
    default: () => false,
  },
});

const baseClasses = computed(
  () =>
    "inline-flex items-center justify-center border rounded-md font-medium focus:outline-none transition ease-in-out duration-150"
);
const colorClasses = computed(() => {
  const colors = {
    primary: "border-transparent text-white bg-main-color",
    secondary: "border-transparent text-white bg-gray-500",
    success: "border-transparent text-white bg-green-500",
    danger: "border-transparent text-white bg-red-500",
    info: "border-transparent text-[#3483fa] bg-[rgba(65,137,230,.15)]"
  };
  return colors[props.color] || colors.primary;
});
const sizeClasses = computed(() => {
  const sizes = {
    sm: "px-4 py-2 text-sm leading-5",
    md: "px-5 py-3 text-base leading-6",
    lg: "px-6 py-4 text-lg leading-7",
  };
  return sizes[props.size] || sizes.md;
});
</script>

<template>
  <button
    :data-anima="animation"
    class="button w-full"
    :class="[baseClasses, colorClasses, sizeClasses]"
    :disabled="disabled"
    :type="type"
  >
    <Icon name="mdi:loading" class="animate-spin" v-if="loading" size="20" />
    <slot v-else />
  </button>
</template>

<style lang="scss" scoped>
button {
  font-size: 14px;
  &:hover:not([disabled]) {
    transform: scale(1.07);
  }

  &:disabled {
    background: #f7f7f7 !important;
    color: #333 !important;
    opacity: 0.4 !important;
  }
}
</style>