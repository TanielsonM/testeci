<script setup>
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
});
const emit = defineEmits(["update:checked"]);
</script>

<template>
  <input
    @input="(event) => emit('update:checked', event.target.checked)"
    type="checkbox"
    :checked="checked"
    :id="`checkbox-${props.id}`"
    class="mr-2 hidden"
  />
  <label
    :for="`checkbox-${props.id}`"
    class="flex flex-row items-center font-bold cursor-pointer select-none gap-3"
  >
    <div class="flex items-center justify-center bg-white w-4 h-4 rounded">
      <Icon name="mdi:check-bold" v-if="checked"/>
    </div>
    <span class="text-sm flex-wrap" :class="labelCustomClass">{{ label }}</span>
  </label>
</template>