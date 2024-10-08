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
  selectName: {
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
    translate="no"
  >
    {{ label }}
    <select
      class="flex h-full max-h-[54.8px] w-full items-center rounded border border-bd-color bg-checkout p-4 font-medium outline-none transition-colors duration-300 placeholder:opacity-75 focus-within:border-main-color hover:border-main-color focus:border-main-color"
      :class="customClass"
      :disabled="disabled"
      :value="modelValue"
      :id="selectId"
      :name="selectName"
      @change="onChange"
    >
      <option v-if="placeholder" selected disabled value="" class="opacity-75" translate="no">
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
<style>
select {
  -webkit-appearance: none;
  -moz-appearance: none;
  appearance: none;
  background: transparent
    url("data:image/svg+xml;charset=utf-8,%3Csvg xmlns='http://www.w3.org/2000/svg' width='4' height='5'%3E%3Cpath fill='%23343a40' d='M2 0L0 2h4zm0 5L0 3h4z'/%3E%3C/svg%3E")
    right 0.75rem center/8px 10px no-repeat !important;
}
</style>
