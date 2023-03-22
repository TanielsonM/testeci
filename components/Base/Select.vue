<script setup>
const props = defineProps({
  type: {
    type: String,
    required: false,
    default: () => "text",
  },
  modelValue: {
    type: [String, Number],
    required: false,
    default: () => "",
  },
  label: {
    type: String,
    required: false,
    default: () => "",
  },
  hint: {
    type: String,
    required: false,
    default: () => "",
  },
  error: {
    type: [String, Boolean],
    required: false,
    default: () => false,
  },
  placeholder: {
    type: [String, Boolean],
    required: false,
    default: () => false,
  },
  animation: {
    type: String,
    required: false,
    default: () => "bottom",
  },
  disabled: {
    type: Boolean,
    required: false,
    default: false,
  },
  customClass: {
    type: String,
    required: false,
    default: () => "",
  },
  selectId: {
    type: String,
    required: false,
    default: () => "",
  },
  data: {
    type: Array,
    required: false,
    default: () => [],
  },
});
const emit = defineEmits([
  "update:modelValue",
  "prepend-click",
  "append-click",
]);
const onChange = (event) => {
  emit("update:modelValue", event.target.value);
};
</script>

<template>
  <label
    for="input"
    class="text-txt-color flex w-full flex-col items-start gap-2 font-semibold"
    :data-anima="animation"
  >
    {{ label }}
    <select
      class="border-bd-color bg-checkout focus-within:border-main-color focus:border-main-color hover:border-main-color flex h-full w-full items-center rounded border p-4 font-medium transition-colors duration-300"
      :class="customClass"
      :disabled="disabled"
      :value="modelValue"
      :id="selectId"
      @change="onChange"
    >
      <option v-if="placeholder" selected disabled value="">
        {{ placeholder }}
      </option>
      <slot>
        <option v-for="d in data" :key="d" :value="d.value">
          {{ d.label }}
        </option>
      </slot>
    </select>
    <small data-anima="top" v-if="!error">{{ hint }}</small>
    <small data-anima="right" class="text-red-400" v-else>{{ error }}</small>
  </label>
</template>
