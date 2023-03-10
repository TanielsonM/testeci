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
  icon: {
    type: [String, Boolean],
    required: false,
    default: () => false,
  },
  "icon-position": {
    type: String,
    required: false,
    default: () => "end",
    validator: (value) => ["start", "end"].includes(value),
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
    default: () => ""
  }
});
const emit = defineEmits([
  "update:modelValue",
  "prepend-click",
  "append-click",
]);
const onInput = (event) => {
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
    <section
      class="border-bd-color bg-checkout focus-within:border-main-color focus:border-main-color hover:border-main-color flex w-full items-center gap-5 rounded border p-4 transition-colors duration-300"
    >
      <Icon
        :name="icon"
        v-if="icon && iconPosition === 'start'"
        size="24"
        class="text-txt-color focus:text-main-color hover:text-main-color cursor-pointer"
        @click="emit('prepend-click')"
      />
      <input
        v-if="!mask"
        :id="inputId"
        :type="type"
        :value="modelValue"
        :placeholder="placeholder"
        :autocomplete="autocomplete"
        :disabled="disabled"
        class="bg-checkout h-full w-full outline-none"
        :class="customClass"
        @input="onInput"
      />
      <input
        v-else
        :id="inputId"
        :type="type"
        :value="modelValue"
        :placeholder="placeholder"
        :autocomplete="autocomplete"
        :disabled="disabled"
        class="bg-checkout h-full w-full outline-none"
        :class="customClass"
        v-mask="mask"
        @input="onInput"
      />
      <Icon
        :name="icon"
        v-if="icon && iconPosition === 'end'"
        size="24"
        class="text-txt-color focus:text-main-color hover:text-main-color cursor-pointer"
        @click="emit('append-click')"
      />
    </section>
    <small data-anima="top" v-if="!error">{{ hint }}</small>
    <small data-anima="right" class="text-red-400" v-else>{{ error }}</small>
  </label>
</template>

<style lang="scss" scoped>
input::placeholder {
  text-transform: none;
  font-weight: 400;
  font-size: 15px !important;
  color: var(--txt-color) !important;
}
</style>