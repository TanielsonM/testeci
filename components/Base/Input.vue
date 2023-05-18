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
    default: () => "",
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
  readonly: {
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
    type: [String, Object],
    required: false,
    default: () => "",
  },
});

const emit = defineEmits([
  "update:modelValue",
  "prepend-click",
  "append-click",
  "blur",
  "focus",
]);

const onInput = (event) => {
  emit("update:modelValue", event.target.value);
};
</script>

<template>
  <div class="default-input w-full">
    <label
      v-if="!!label"
      for="input"
      class="flex w-full flex-col items-start gap-2 text-[14px] font-semibold text-txt-color lg:text-[15px]"
    >
      {{ label }}
    </label>
    <section
      class="w-full items-center gap-5 rounded border border-bd-color bg-checkout p-4 transition-colors duration-300 focus-within:border-main-color hover:border-main-color focus:border-main-color"
      :class="readonly ? customClass : null"
    >
      <Icon
        :name="icon"
        v-if="icon && iconPosition === 'start'"
        size="24"
        class="cursor-pointer text-txt-color hover:text-main-color focus:text-main-color"
        @click="emit('prepend-click')"
      />
      <VeeField :name="inputName" :rules="rules" v-slot="{ field }">
        <input
          v-if="!mask"
          v-bind="field"
          :type="type"
          :id="inputId"
          :value="modelValue"
          :class="customClass"
          :disabled="disabled"
          :readonly="readonly"
          :placeholder="placeholder"
          :autocomplete="autocomplete"
          class="h-full w-full bg-checkout text-txt-color outline-none placeholder:opacity-75"
          @input="onInput"
          @blur="emit('blur')"
          @focus="emit('focus')"
        />
        <input
          v-else
          v-maska
          v-bind="field"
          :type="type"
          :id="inputId"
          :value="modelValue"
          :class="customClass"
          :disabled="disabled"
          :readonly="readonly"
          :placeholder="placeholder"
          :autocomplete="autocomplete"
          class="h-full w-full bg-checkout text-txt-color outline-none placeholder:opacity-75"
          :data-maska="mask"
          @input="onInput"
          @blur="emit('blur')"
          @focus="emit('focus')"
        />
      </VeeField>
      <Icon
        :name="icon"
        v-if="icon && iconPosition === 'end'"
        size="24"
        class="cursor-pointer text-txt-color hover:text-main-color focus:text-main-color"
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
  </div>
</template>
<style lang="scss">
.default-input {
  label {
    padding-bottom: 0.5rem;
  }

  section {
    padding-bottom: 0.8rem;
  }
}

.readonly-button {
  background: #f0f0f0 !important;
  border: none !important;
  color: #000 !important;
  font-weight: 400 !important;
  font-size: 0.95rem;
}
</style>
