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
    class="flex cursor-pointer select-none flex-row items-center gap-3 font-bold"
  >
    <div class="flex h-4 w-4 items-center justify-center rounded bg-white">
      <Icon name="mdi:check-bold" v-if="checked" />
    </div>
    <span class="flex-wrap text-sm" :class="labelCustomClass">{{ label }}</span>
  </label>
</template>
