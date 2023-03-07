<script setup>
const props = defineProps({
  id: {
    type: [String, Number],
    required: true,
    default: () => 1,
  },
  modelValue: {
    type: Boolean,
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
  emit("update:modelValue", event.target.value === "true" ? false : true);
};
</script>

<template>
  <label class="relative inline-flex cursor-pointer items-start gap-3">
    <input
      type="checkbox"
      :value="modelValue"
      @change="onChange"
      :id="`checkbox-${props.id}`"
      class="peer sr-only"
      :checked="modelValue"
    />
    <div
      class="peer-checked:bg-main-color peer h-5 w-9 rounded-full bg-gray-400 after:absolute after:top-[2px] after:left-[2px] after:h-4 after:w-4 after:rounded-full after:border after:border-gray-300 after:bg-white after:transition-all after:content-[''] peer-checked:after:translate-x-full peer-checked:after:border-white peer-focus:outline-none"
    ></div>
    <span class="text-txt-color flex-wrap font-normal">{{ label }}</span>
  </label>
</template>
