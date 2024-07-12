<script setup>
import { defineProps, defineEmits } from 'vue';

const props = defineProps({
  id: {
    type: [String, Number],
    required: true,
    default: () => 1,
  },
  checked: {
    type: Boolean,
    required: false,
    default: () => false,
  },
  label: {
    type: String,
    required: false,
    default: () => "",
  },
  labelCustomClass: {
    type: String,
    required: false,
    default: () => "",
  },
  disabled: {
    type: Boolean,
    required: false,
    default: () => false,
  },
  saveData: {
    type: Boolean,
    required: false,
    default: () => false,
  },
});

const emit = defineEmits(["update:checked"]);

const handleChange = (event) => {
  emit('update:checked', event.target.checked);
};
</script>

<template>
  <input
    type="checkbox"
    @change="handleChange"
    :checked="checked"
    :id="`checkbox-${id}`"
    class="mr-2 hidden"
    :disabled="disabled"
  />
  <label
    v-if="saveData"
    :for="`checkbox-${id}`"
    class="flex cursor-pointer select-none items-center gap-3"
  >
    <div class="flex items-center justify-center rounded h-6 w-6 border-2 border-greenn">
      <div class="flex h-4 w-4 items-center justify-center text-txt-color" v-if="checked">
        <Icon name="mdi:check-bold" />
      </div>
    </div>
    <span class="text-sm text-txt-color">{{ label }}</span>
  </label>

  <label
    v-else
    :for="`checkbox-${id}`"
    class="flex cursor-pointer select-none flex-row items-center gap-3 font-bold"
  >
    <div class="flex h-4 w-4 items-center justify-center rounded bg-white">
      <Icon name="mdi:check-bold" v-if="checked" />
    </div>
    <span class="flex-wrap text-sm" :class="labelCustomClass">{{ label }}</span>
  </label>
</template>
