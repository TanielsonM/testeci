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
    default: () => "",
  },
  inputName: {
    type: String,
    required: false,
    default: () => "",
  },
  rules: {
    type: String,
    required: false,
    default: () => "",
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
    class="text-txt-color flex w-full flex-col items-start gap-1 font-semibold"
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
      <VeeField
        v-if="!mask"
        :name="inputName"
        :id="inputId"
        :type="type"
        :value="modelValue"
        :placeholder="placeholder"
        :autocomplete="autocomplete"
        :disabled="disabled"
        class="bg-checkout h-full w-full outline-none"
        :class="customClass"
        :rules="rules"
        @input="onInput"
      />
      <VeeField
        v-else
        :name="inputName"
        :id="inputId"
        :type="type"
        :value="modelValue"
        :placeholder="placeholder"
        :autocomplete="autocomplete"
        :disabled="disabled"
        class="bg-checkout h-full w-full outline-none"
        :class="customClass"
        :rules="rules"
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
    <small class="text-red-400" v-if="error">
      <slot name="error">
        {{ error }}
      </slot>
    </small>
    <VeeErrorMessage
      v-else-if="!!rules"
      as="p"
      :name="inputName"
      data-anima="right"
      v-slot="{ message }"
    >
      <small class="text-red-400">
        <slot name="error">
          {{ message }}
        </slot>
      </small>
    </VeeErrorMessage>
  </label>
</template>
