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
    class="flex w-full flex-col items-start gap-2 text-[14px] font-semibold text-txt-color lg:text-[15px]"
    :data-anima="animation"
  >
    {{ label }}
    <select
      class="flex h-full max-h-[54.8px] w-full items-center rounded border border-bd-color bg-checkout p-4 font-medium outline-none transition-colors duration-300 placeholder:opacity-75 focus-within:border-main-color hover:border-main-color focus:border-main-color"
      :class="customClass"
      :disabled="disabled"
      :value="modelValue"
      :id="selectId"
      @change="onChange"
    >
      <option v-if="placeholder" selected disabled value="" class="opacity-75">
        {{ placeholder }}
      </option>
      <slot>
        <option v-for="d in data" :key="d" :value="d.value">
          {{ d.label }}
        </option>
      </slot>
    </select>
    <small data-anima="top" v-if="!error">{{ hint }}</small>
    <small class="font-normal text-red-400" v-if="error">
      <slot name="error">
        {{ error }}
      </slot>
    </small>
  </label>
</template>
