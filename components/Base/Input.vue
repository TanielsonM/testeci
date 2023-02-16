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
    type: String,
    required: false,
    default: () => "",
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
    class="flex flex-col items-start w-full text-txt-color font-semibold gap-2"
    :data-anima="animation"
  >
    {{ label }}
    <section
      class="
        w-full
        border border-bd-color
        rounded
        p-4
        transition-colors
        duration-300
        bg-checkout
        focus:border-main-color
        hover:border-main-color
        flex
        items-center
        gap-5
      "
    >
      <Icon
        :name="icon"
        v-if="icon && iconPosition === 'start'"
        size="24"
        class="
          text-txt-color
          cursor-pointer
          focus:text-main-color
          hover:text-main-color
        "
        @click="emit('prepend-click')"
      />
      <input
        v-if="!mask"
        :type="type"
        :value="modelValue"
        :placeholder="placeholder"
        :autocomplete="autocomplete"
        class="w-full h-full bg-checkout outline-none"
        @input="onInput"
      />
      <input
        v-else
        :type="type"
        :value="modelValue"
        :placeholder="placeholder"
        :autocomplete="autocomplete"
        class="w-full h-full bg-checkout outline-none"
        v-mask="mask"
        @input="onInput"
      />
      <Icon
        :name="icon"
        v-if="icon && iconPosition === 'end'"
        size="24"
        class="
          text-txt-color
          cursor-pointer
          focus:text-main-color
          hover:text-main-color
        "
        @click="emit('append-click')"
      />
    </section>
    <small data-anima="top" v-if="!error">{{ hint }}</small>
    <small data-anima="right" class="text-red-400" v-else>{{ error }}</small>
  </label>
</template>