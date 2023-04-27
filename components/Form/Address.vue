<script setup lang="ts">
// Data
import states from "@/data/states";
import { Frete, Address, ShippingAddress } from "@/types";
// Store
import { useCheckoutStore } from "@/store/checkout";
import { useAddressStore } from "@/store/forms/address";
import { useLeadsStore } from "@/store/modules/leads";

const store = useAddressStore();
const checkout = useCheckoutStore();
const leadsStore = useLeadsStore();

// Props
const props = defineProps({
  type: {
    type: String,
    required: false,
    default: () => "charge",
    validator: (value: string) => ["charge", "shipping"].includes(value),
  },
});

// Variables
const form = ref<Address>({
  zipcode: "",
  street: "",
  number: "",
  city: "",
  neighborhood: "",
  complement: "",
  state: "",
});

const deliveryOptions = ref<Frete[] | undefined>();

// Watches
watch(form.value, async () => {
  await store.setFields(form.value, props.type);
  leadsStore.syncAddress();
});
watch(deliveryOptions, () => {});

// methods
async function getAddress(cep = "") {
  if (cep.length < 8) {
    if (!!checkout.deliveryOptions) checkout.resetShipping();
    return;
  }

  await useFetch(`https://viacep.com.br/ws/${cep}/json`)
    .then(async ({ data }) => {
      if (!!data) {
        let value: ShippingAddress = data.value as ShippingAddress;

        form.value.number = "";
        form.value.street = value.logradouro;
        form.value.city = value.localidade;
        form.value.neighborhood = value.bairro;
        form.value.complement = value.complemento;
        form.value.state = value.uf;

        const productId = checkout.product_id;
        await checkout.calculateShipping(cep, productId);
      }
    })
    .then(() => {
      document
        .querySelector<HTMLInputElement>(`#number-address-${props.type}`)
        ?.focus();
    });
}

function updateLead() {
  setTimeout(function () {
    leadsStore.updateLead();
  }, 10000);
}
</script>

<template>
  <form class="grid w-full grid-cols-12 gap-3">
    <BaseInput
      :blur="updateLead"
      :label="$t('forms.address.inputs.zipcode.label')"
      :placeholder="$t('forms.address.inputs.zipcode.placeholder')"
      mask="#####-###"
      class="col-span-12 xl:col-span-3"
      v-model="form.zipcode"
      @input="getAddress(form.zipcode.replace('-', ''))"
    />
    <BaseInput
      :blur="updateLead"
      :label="$t('forms.address.inputs.public_place.label')"
      :placeholder="$t('forms.address.inputs.public_place.placeholder')"
      class="col-span-12 xl:col-span-6"
      v-model="form.street"
    />
    <BaseInput
      :blur="updateLead"
      :inputId="`number-address-${type}`"
      :label="$t('forms.address.inputs.number.label')"
      :placeholder="$t('forms.address.inputs.number.placeholder')"
      mask="###########"
      class="col-span-12 xl:col-span-3"
      v-model="form.number"
    />
    <BaseInput
      :blur="updateLead"
      :label="$t('forms.address.inputs.city.label')"
      :placeholder="$t('forms.address.inputs.city.placeholder')"
      class="col-span-12 xl:col-span-6"
      v-model="form.city"
    />
    <BaseInput
      :blur="updateLead"
      :label="$t('forms.address.inputs.neighborhood.label')"
      :placeholder="$t('forms.address.inputs.neighborhood.placeholder')"
      class="col-span-12 xl:col-span-6"
      v-model="form.neighborhood"
    />
    <BaseInput
      :blur="updateLead"
      :label="$t('forms.address.inputs.complement.label')"
      :placeholder="$t('forms.address.inputs.complement.placeholder')"
      class="col-span-12 xl:col-span-7"
      v-model="form.complement"
    />
    <BaseInput
      :blur="updateLead"
      :label="$t('forms.address.inputs.state.label')"
      :placeholder="$t('forms.address.inputs.state.placeholder')"
      class="col-span-12 xl:col-span-5"
      v-model="form.state"
      v-if="checkout.selectedCountry !== 'BR'"
    />
    <BaseSelect
      v-else
      :blur="updateLead"
      :label="$t('forms.address.inputs.state.label')"
      :placeholder="$t('forms.address.inputs.state.placeholder')"
      class="col-span-12 xl:col-span-5"
      v-model="form.state"
      :data="states"
    />
  </form>
</template>
