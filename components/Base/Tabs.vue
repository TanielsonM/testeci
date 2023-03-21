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
    class="tabs flex w-full flex-wrap items-center gap-5"
    v-if="tabs.length"
  >
    <button
      v-for="(tab, index) in tabs.filter((item) => !!item)"
      :key="index"
      @click="clicked(tab.value)"
      :class="{ active: tab.value.includes(modelValue) }"
      class="button border-bd-color text-txt-color flex items-center justify-center gap-3 rounded-lg border py-4 px-6 text-[13px] font-semibold"
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
}
</style>
