<script setup>
const props = defineProps({
  id: {
    type: [String, Number],
    required: true,
    default: () => 1,
  },
  modelValue: {
    type: [String, Boolean],
    required: false,
    default: () => false,
  },
  label: {
    type: String,
    required: false,
    default: () => "",
  },
});
const emit = defineEmits(["update:modelValue"]);

const onChange = (event) => {
  emit("update:modelValue", event.target.value);
};
</script>

<template>
  <label class="relative inline-flex cursor-pointer items-start gap-3">
    <input
      type="checkbox"
      :value="modelValue"
      @input="onChange"
      :id="`checkbox-${props.id}`"
      class="peer sr-only"
    />
    <div
      class="peer-checked:bg-main-color peer h-6 w-11 rounded-full bg-gray-400 after:absolute after:top-[2px] after:left-[2px] after:h-5 after:w-5 after:rounded-full after:border after:border-gray-300 after:bg-white after:transition-all after:content-[''] peer-checked:after:translate-x-full peer-checked:after:border-white peer-focus:outline-none"
    ></div>
    <span class="text-txt-color flex-wrap font-normal">{{ label }}</span>
  </label>
</template>
