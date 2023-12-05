<script setup>
const props = defineProps({
  disabled: {
    type: Boolean,
    default: () => false,
  },
  type: {
    type: String,
    default: "default",
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
    info: "border-transparent text-[#3483fa] bg-[rgba(65,137,230,.15)]",
    blue: "border-transparent text-white bg-[#3483fa]",
    bordered: "border-[#3483fa] text-[#3483fa] bg-transparent",
    transparent:
      "border-transparent bg-transparent text-txt-color !items-start !justify-start !p-0",
    paypal: "!bg-[#2C2E2F] border-transparent !text-white !opacity-70",
  };
  return colors[props.color] || colors.primary;
});

const sizeClasses = computed(() => {
  const sizes = {
    vsm: "sm:px-4 sm:py-2 small leading-5",
    sm: "sm:px-4 sm:py-2 text-sm leading-5",
    md: "sm:px-5 sm:py-3 text-base leading-6",
    lg: "sm:px-6 sm:py-4 text-lg leading-7",
  };
  return sizes[props.size] || sizes.md;
});
</script>

<template>
  <button
    class="button w-full px-3 py-2"
    :class="[baseClasses, colorClasses, sizeClasses]"
    :disabled="disabled || loading"
  >
    <Icon name="mdi:loading" class="animate-spin" v-if="loading" size="20" />
    <slot v-else />
  </button>
</template>

<style lang="scss" scoped>
.button {
  font-size: 14px;
  animation: ease-in-out 300ms;
  &:hover:not([disabled], .pulse) {
    transform: scale(1.07) !important;
  }

  &:disabled {
    background: #f7f7f7;
    color: #333;
    opacity: 0.4;
  }

  &.small {
    font-size: 13px;
  }
}
</style>
