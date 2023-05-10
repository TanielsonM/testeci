<script setup lang="ts">
// Data
import states from "@/data/states";
import { Frete, Address, ShippingAddress } from "@/types";
// Store
import { useCheckoutStore } from "@/store/checkout";
import { useAddressStore } from "@/store/forms/address";
import { useLeadsStore } from "@/store/modules/leads";
import { usePaymentStore } from "@/store/modules/payment";
import {
  validateZip,
  validateStreet,
  validateNumber,
  validateState,
  validateNeighborhood,
  validateCity,
} from "@/rules/form-validations";

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
const isZipDissabled = ref(false);

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
  isZipDissabled.value = true;

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
        await checkout.calculateShipping(cep);
      }
    })
    .then(() => {
      document
        .querySelector<HTMLInputElement>(`#number-address-${props.type}`)
        ?.focus();
    })
    .finally(() => {
      isZipDissabled.value = false;
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
      @blur="updateLead"
      :label="$t('forms.address.inputs.zipcode.label')"
      :placeholder="$t('forms.address.inputs.zipcode.placeholder')"
      mask="#####-###"
      input-name="zipcode-field"
      input-id="zipcode-field"
      class="col-span-12 xl:col-span-3"
      v-model="form.zipcode"
      @input="getAddress(form.zipcode.replace('-', ''))"
      :disabled="isZipDissabled"
      :error="form.zipcode ? !validateZip.isValidSync(form.zipcode) : undefined"
    >
      <template #error>
        {{ $t("checkout.address.feedbacks.zipcode") }}
      </template>
    </BaseInput>
    <BaseInput
      @blur="updateLead"
      :label="$t('forms.address.inputs.public_place.label')"
      :placeholder="$t('forms.address.inputs.public_place.placeholder')"
      input-name="street-field"
      input-id="street-field"
      class="col-span-12 xl:col-span-6"
      v-model="form.street"
      :error="
        form.street ? !validateStreet.isValidSync(form.street) : undefined
      "
    >
      <template #error>
        {{ $t("checkout.address.feedbacks.street") }}
      </template>
    </BaseInput>
    <BaseInput
      @blur="updateLead"
      :inputId="`number-address-${type}`"
      :label="$t('forms.address.inputs.number.label')"
      :placeholder="$t('forms.address.inputs.number.placeholder')"
      mask="###########"
      input-name="number_address-field"
      class="col-span-12 xl:col-span-3"
      v-model="form.number"
      :error="
        form.number ? !validateNumber.isValidSync(form.number) : undefined
      "
    >
      <template #error>
        {{ $t("checkout.address.feedbacks.number") }}
      </template>
    </BaseInput>
    <BaseInput
      @blur="updateLead"
      :label="$t('forms.address.inputs.city.label')"
      :placeholder="$t('forms.address.inputs.city.placeholder')"
      class="col-span-12 xl:col-span-6"
      input-name="city-field"
      input-id="city-field"
      v-model="form.city"
      :error="form.city ? !validateCity.isValidSync(form.city) : undefined"
    >
      <template #error>
        {{ $t("checkout.address.feedbacks.city") }}
      </template>
    </BaseInput>
    <BaseInput
      @blur="updateLead"
      :label="$t('forms.address.inputs.neighborhood.label')"
      :placeholder="$t('forms.address.inputs.neighborhood.placeholder')"
      input-name="neighborhood-field"
      input-id="neighborhood-field"
      class="col-span-12 xl:col-span-6"
      v-model="form.neighborhood"
      :error="
        form.neighborhood
          ? !validateNeighborhood.isValidSync(form.neighborhood)
          : undefined
      "
    >
      <template #error>
        {{ $t("checkout.address.feedbacks.neighborhood") }}
      </template>
    </BaseInput>
    <BaseInput
      @blur="updateLead"
      :label="$t('forms.address.inputs.complement.label')"
      :placeholder="$t('forms.address.inputs.complement.placeholder')"
      class="col-span-12 xl:col-span-7"
      v-model="form.complement"
    />
    <BaseInput
      @blur="updateLead"
      :label="$t('forms.address.inputs.state.label')"
      :placeholder="$t('forms.address.inputs.state.placeholder')"
      class="col-span-12 xl:col-span-5"
      input-name="state-field"
      input-id="state-field"
      v-model="form.state"
      v-if="checkout.selectedCountry !== 'BR'"
      :error="form.state ? !validateState.isValidSync(form.state) : undefined"
    >
      <template #error>
        {{ $t("checkout.address.feedbacks.state") }}
      </template>
    </BaseInput>
    <BaseInput
      v-else
      @blur="updateLead"
      :label="$t('forms.address.inputs.state.label')"
      :placeholder="$t('forms.address.inputs.state.placeholder')"
      input-name="district-field"
      input-id="district-field"
      class="col-span-12 xl:col-span-5"
      v-model="form.state"
      :data="states"
      :error="form.state ? !validateState.isValidSync(form.state) : undefined"
    >
      <template #error>
        {{ $t("checkout.address.feedbacks.state") }}
      </template>
    </BaseInput>
  </form>
</template>
