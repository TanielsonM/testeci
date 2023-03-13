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
  selectId: {
    type: String,
    required: false,
    default: () => "",
  },
  data: {
    type: Array,
    required: true,
    default: () => [],
  },
});
const emit = defineEmits([
  "update:modelValue",
  "prepend-click",
  "append-click",
]);
const onInput = (data) => {
  emit("update:modelValue", data.value);
};
const opened = ref(false);
</script>

<template>
  <label
    for="input"
    class="text-txt-color flex w-full flex-col items-start gap-2 font-semibold z-10"
    :data-anima="animation"
  >
    {{ label }}
    <section
      class="border-bd-color bg-checkout focus-within:border-main-color focus:border-main-color hover:border-main-color flex w-full items-center rounded border p-4 transition-colors duration-300"
      @click="opened = !opened"
    >
      <Icon
        :name="icon"
        v-if="icon && iconPosition === 'start'"
        size="24"
        class="text-txt-color focus:text-main-color hover:text-main-color cursor-pointer"
        @click="emit('prepend-click')"
      />
      <button
        type="button"
        class="w-full rounded-md bg-checkout text-txt-color font-medium text-left transition ease-in-out duration-300 sm:text-sm sm:leading-5"
        :showAsPlaceholder="modelValue"
      >
        {{
          modelValue
            ? data.filter((item) => item.value === modelValue).pop().label
            : placeholder
        }}
      </button>
      <div
        v-if="opened"
        data-anima="top"
        class="bg-checkout absolute z-10 max-h-[400px] w-full overflow-y-auto rounded shadow -ml-4 mt-[300px]"
      >
        <ul
          tabindex="-1"
          role="listbox"
          aria-labelledby="listbox-label"
          aria-activedescendant="listbox-item-3"
          class="max-h-56 text-base shadow-xs overflow-auto focus:outline-none sm:text-sm"
        >
          <li
            tabindex="0"
            id="listbox-item-0"
            role="option"
            v-for="d in data"
            v-bind:key="d"
            class="select-none cursor-pointer hover:bg-main-color rounded"
            @click="onInput(d)"
          >
            <div class="flex items-center justify-between h-10 px-5 text-txt-color">
              <span class="block truncate">
                {{ d.label }}
              </span>
              <Icon
                name="mdi:check-bold"
                size="18"
                v-if="d.value === modelValue"
              />
            </div>
          </li>
        </ul>
      </div>
      <Icon
        name="ic:sharp-arrow-drop-down"
        size="24"
        class="text-txt-color focus:text-main-color hover:text-main-color cursor-pointer duration-300"
        :class="{ 'rotate-180': opened }"
      />
    </section>
    <small data-anima="top" v-if="!error">{{ hint }}</small>
    <small data-anima="right" class="text-red-400" v-else>{{ error }}</small>
  </label>
</template>