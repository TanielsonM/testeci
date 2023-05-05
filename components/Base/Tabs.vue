<script setup>
const props = defineProps({
  modelValue: {
    type: [String, Number, Boolean],
    required: false,
    default: () => "",
  },
  tabs: {
    type: Array,
    required: false,
    default: () => [],
  },
  isMobile: {
    type: Boolean,
    required: false,
    default: false,
  },
});

const emit = defineEmits(["update:modelValue"]);

function clicked(value) {
  if (typeof value !== "string") {
    emit("update:modelValue", value[0]);
    return;
  }
  emit("update:modelValue", value);
}
</script>

<template>
  <section
    class="tabs flex w-full items-center gap-5 overflow-x-auto"
    :class="{ 'flex-wrap': !isMobile, 'pb-5': isMobile }"
    v-if="tabs.length"
  >
    <button
      v-for="(tab, index) in tabs.filter((item) => !!item)"
      :key="index"
      @click="clicked(tab.value)"
      :class="{
        active: tab.value.includes(modelValue),
        'flex-col': isMobile,
        mobile: isMobile,
        'px-6': !isMobile,
        'px-4': isMobile,
      }"
      class="button flex items-center justify-center gap-3 rounded-lg border border-bd-color py-4 text-[13px] font-semibold text-txt-color"
    >
      <Icon :name="tab.icon" v-if="tab?.icon" size="16" />
      <p>{{ tab?.label }}</p>
    </button>
  </section>
</template>

<style lang="scss" scoped>
.button {
  &.active {
    border-color: var(--main-color);
    color: var(--main-color);
  }
  &.mobile {
    min-width: 105px;
    min-height: 100px;
    max-width: 105px;
    max-height: 100px;
  }
}
</style>
