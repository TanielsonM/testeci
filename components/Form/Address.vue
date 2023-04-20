<script setup>
// Data
import states from "@/data/states";
// Store
import { useCheckoutStore } from "@/store/checkout";
import { useAddressStore } from "@/store/forms/address";
const store = useAddressStore();
const checkout = useCheckoutStore();
// Props
const props = defineProps({
  type: {
    type: String,
    required: false,
    default: () => "charge",
    validator: (value) => ["charge", "shipping"].includes(value),
  },
});

// Variables
const form = ref({
  zipcode: "",
  street: "",
  number: "",
  city: "",
  neighborhood: "",
  complement: "",
  state: "",
});

// Watches
watch(form.value, () => {
  store.setFields(form.value, props.type);
});

// methods
async function getAddress(cep = "") {
  if (cep.length < 8) return;
  await useFetch(`https://viacep.com.br/ws/${cep}/json`)
    .then(({ data }) => {
      form.value.number = "";
      form.value.street = data.value.logradouro;
      form.value.city = data.value.localidade;
      form.value.neighborhood = data.value.bairro;
      form.value.complement = data.value.complemento;
      form.value.state = data.value.uf;
    })
    .then(() => {
      document.querySelector(`#number-address-${props.type}`).focus();
    });
}
</script>

<template>
  <form class="grid w-full grid-cols-12 gap-3">
    <BaseInput
      :label="$t('forms.address.inputs.zipcode.label')"
      :placeholder="$t('forms.address.inputs.zipcode.placeholder')"
      mask="#####-###"
      class="col-span-12 xl:col-span-3"
      v-model="form.zipcode"
      @input="getAddress(form.zipcode.replace('-', ''))"
      />
    <BaseInput
      :label="$t('forms.address.inputs.public_place.label')"
      :placeholder="$t('forms.address.inputs.public_place.placeholder')"
      class="col-span-12 xl:col-span-6"
      v-model="form.street"
    />
    <BaseInput
      :inputId="`number-address-${type}`"
      :label="$t('forms.address.inputs.number.label')"
      :placeholder="$t('forms.address.inputs.number.placeholder')"
      mask="###########"
      class="col-span-12 xl:col-span-3"
      v-model="form.number"
      />
    <BaseInput
      :label="$t('forms.address.inputs.city.label')"
      :placeholder="$t('forms.address.inputs.city.placeholder')"
      class="col-span-12 xl:col-span-6"
      v-model="form.city"
    />
    <BaseInput
      :label="$t('forms.address.inputs.neighborhood.label')"
      :placeholder="$t('forms.address.inputs.neighborhood.placeholder')"
      class="col-span-12 xl:col-span-6"
      v-model="form.neighborhood"
    />
    <BaseInput
      :label="$t('forms.address.inputs.complement.label')"
      :placeholder="$t('forms.address.inputs.complement.placeholder')"
      class="col-span-12 xl:col-span-7"
      v-model="form.complement"
    />
    <BaseInput
      :label="$t('forms.address.inputs.state.label')"
      :placeholder="$t('forms.address.inputs.state.placeholder')"
      class="col-span-12 xl:col-span-5"
      v-model="form.state"
      v-if="checkout.selectedCountry !== 'BR'"
    />
    <BaseSelect
      v-else
      :label="$t('forms.address.inputs.state.label')"
      :placeholder="$t('forms.address.inputs.state.placeholder')"
      class="col-span-12 xl:col-span-5"
      v-model="form.state"
      :data="states"
    />
  </form>
</template>
