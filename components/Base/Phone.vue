<script lang="ts" setup>
import { VueTelInput } from "vue-tel-input";
import { usePersonalStore } from "@/store/forms/personal";
import { phoneValidation } from "@/rules/form-validations";
import { useCheckoutStore } from "~~/store/checkout";
import "vue-tel-input/vue-tel-input.css";

const props = defineProps({
  type: {
    type: String,
    required: false,
    default: () => "text",
  },
  country: {
    type: String,
    required: false,
    default: () => null,
  },
  modelValue: {
    type: [String, Number],
    required: false,
    default: () => "",
  },
  validate: {
    type: Boolean,
    required: false,
    default: () => true,
  },
  blur: {
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
  animation: {
    type: String,
    required: false,
    default: () => "bottom",
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

const personalStore = usePersonalStore();
const checkoutStore = useCheckoutStore();
const { validPhone } = storeToRefs(personalStore);
const { selectedCountry } = storeToRefs(checkoutStore);

let cellphone = ref("");
let isValid = true;
const { t } = useI18n();

const defaultCountry = computed(() => {
  switch(selectedCountry.value) {
    case "UK":  return "GB";
    case "OUTROS": return "BR";
    default: return selectedCountry.value;
  }
})

const bindProps = {
  mode: "international",
  placeholder: t("forms.personal.inputs.cellphone.placeholder"),
  required: true,
  enabledCountryCode: true,
  autoDefaultCountry: false,
  defaultCountry: defaultCountry.value,
  enabledFlags: true,
  autocomplete: "off",
  name: "cellphone",
  maxLen: 25,
  inputOptions: {
    placeholder: t("forms.personal.inputs.cellphone.placeholder"),
    showDialCode: false,
  },
};

const emit = defineEmits([
  "update:modelValue",
  "prepend-click",
  "append-click",
  "blur",
  "input",
]);

const onInput = (event: any) => {
  emit("update:modelValue", event);
};

function validatePhone(phoneObject: object | any) {
  if (phoneObject.valid === undefined) {
    return;
  }
  isValid = !!phoneObject.valid;
  validPhone.value = !!phoneObject.valid;
}

onMounted(() => {
  cellphone.value = props.modelValue.toString();
});
</script>

<template>
  <div class="default-input z-40 w-full">
    <label
      v-if="!!label"
      for="input"
      class="flex w-full flex-col items-start gap-2 text-[14px] font-semibold text-txt-color lg:text-[15px]"
    >
      {{ label }}
    </label>
    <section
      class="section w-full items-center gap-5 rounded border border-bd-color bg-checkout transition-colors duration-300 focus-within:border-main-color hover:border-main-color focus:border-main-color"
    >
      <VeeField :name="inputName" :rules="rules">
        <vue-tel-input
          v-bind="bindProps"
          :id="inputId"
          v-model="cellphone"
          :value="modelValue"
          :class="customClass"
          class="h-full w-full bg-checkout text-txt-color outline-none placeholder:opacity-75"
          @validate="validatePhone"
          @on-input="onInput"
          @blur="emit('blur')"
        />
      </VeeField>
    </section>

    <small data-anima="top" v-if="isValid">{{ hint }}</small>
    <small class="text-red-400" v-if="!isValid || error">
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
.vue-tel-input {
  display: flex;
  text-align: left;
  border: 0px;
  margin-top: -0.2rem;
  margin-bottom: 0.25rem;
  outline: none !important;
  box-shadow: none !important;
}

.label {
  padding-bottom: 0.5rem;
}

.section {
  padding: 0.9rem;
  padding-bottom: 0.4rem;
  padding-bottom: 0.3rem !important;
}
.cellphone-input {
  padding: 0.3rem;
}
.vue-tel-input.disabled .selection,
.vue-tel-input.disabled .dropdown,
.vue-tel-input.disabled input {
  cursor: no-drop;
}

.vti__dropdown {
  display: flex;
  flex-direction: column;
  align-content: center;
  justify-content: center;
  position: relative;
  padding: 7px;
  cursor: pointer;
}
.vti__dropdown.show {
  box-sizing: border-box;
  overflow: scroll;
}
.vti__dropdown.open {
  background-color: #f3f3f3;
}
.vti__dropdown.disabled {
  cursor: no-drop;
  outline: none;
  background-color: #f3f3f3;
}
.vti__dropdown:hover {
  background-color: #f3f3f3;
}
.vti__selection {
  font-size: 0.8em;
  display: flex;
  align-items: center;
}
.vti__selection .vti__country-code {
  color: #666;
}
.vti__flag {
  margin-right: 5px;
  margin-left: 5px;
}
.vti__dropdown-list {
  z-index: 1;
  padding: 0;
  margin: 0;
  text-align: left;
  list-style: none;
  max-height: 200px;
  overflow-y: scroll;
  position: absolute;
  left: -1px;
  background-color: #fff;
  border: 1px solid #ccc;
  width: 14rem;
}
.vti__dropdown-list.below {
  top: 33px;
}
.vti__dropdown-list.above {
  top: auto;
  bottom: 100%;
}
.vti__dropdown-arrow {
  transform: scaleY(0.5);
  display: inline-block;
  color: #666;
}
.vti__dropdown-item {
  cursor: pointer;
  padding: 4px 15px;
  font-size: 0.7rem;
}
.vti__dropdown-item.highlighted {
  background-color: #f3f3f3;
}
.vti__dropdown-item.last-preferred {
  border-bottom: 1px solid #cacaca;
}
.vti__dropdown-item .vti__flag {
  display: inline-block;
  margin-right: 5px;
}
.vti__input {
  border: none;
  border-radius: 0 2px 2px 0;
  width: 100%;
  outline: none;
  padding-left: 7px;

  &::placeholder {
    opacity: 0.75;
  }
}
.vti__search_box {
  border: 1px solid #ccc;
  width: 94%;
  padding: 7px;
  margin: 2px;
}
</style>
