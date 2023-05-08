<script setup>
const props = defineProps({
  type: {
    type: String,
    required: false,
    default: () => "text",
  },
  modelValue: {
    type: String,
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
    type: String,
    required: false,
    default: () => "Digite aqui...",
  },
  animation: {
    type: String,
    required: false,
    default: () => "bottom",
  },
  mask: {
    type: [String, Array, Boolean],
    required: false,
    default: () => false,
  },
  autocomplete: {
    type: Boolean,
    required: false,
    default: () => true,
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
  inputId: {
    type: String,
    required: false,
    default: () => "",
  },
  responsive: {
    type: Boolean,
    required: false,
    default: false,
  },
});
const emit = defineEmits([
  "update:modelValue",
  "prepend-click",
  "append-click",
]);
const onInput = (event) => {
  if (props.responsive) {
    updateHeight();
  }

  emit("update:modelValue", event.target.value);
};

onMounted(() => {
  if (props.responsive) {
    updateHeight();
  }
});

const updateHeight = () => {
  const textarea = document.querySelector(`textarea#${props.inputId}`);
  textarea.style.setProperty("height", "auto", "important");
  textarea.style.setProperty(
    "height",
    `${textarea.scrollHeight}px`,
    "important"
  );
};
</script>

<template>
  <label
    for="input"
    class="flex w-full flex-col items-start gap-2 font-semibold text-txt-color"
    :data-anima="animation"
  >
    {{ label }}
    <textarea
      :id="inputId"
      :type="type"
      :value="modelValue"
      :placeholder="placeholder"
      :autocomplete="autocomplete"
      :disabled="disabled"
      class="flex w-full items-center gap-5 rounded border border-bd-color bg-checkout px-4 py-5 text-[13px] outline-none transition-colors duration-300 focus-within:border-main-color hover:border-main-color focus:border-main-color"
      :class="customClass"
      @input="onInput"
    />
    <small data-anima="top" v-if="!error">{{ hint }}</small>
    <small data-anima="right" class="text-red-400" v-else>{{ error }}</small>
  </label>
</template>

<style scoped>
textarea {
  resize: none !important;
  overflow-y: hidden;
}
</style>
