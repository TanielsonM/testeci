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
const payment = usePaymentStore();

const { hasSent } = storeToRefs(payment);
const { shipping, charge } = storeToRefs(store);

// Props
const props = defineProps({
  type: {
    type: String,
    required: false,
    default: () => "charge",
    validator: (value: string) => ["charge", "shipping"].includes(value),
  },
});

const typeAddr = props.type === "charge" ? charge : shipping;

// Variables

const deliveryOptions = ref<Frete[] | undefined>();
const isZipDissabled = ref(false);

// Watches
watch(typeAddr.value, async () => {
  await store.setFields(typeAddr.value, props.type);
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

        typeAddr.value.number = "";
        typeAddr.value.street = value.logradouro;
        typeAddr.value.city = value.localidade;
        typeAddr.value.neighborhood = value.bairro;
        typeAddr.value.complement = value.complemento;
        typeAddr.value.state = value.uf;
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
  }, 1000);
}
</script>

<template>
  <form class="mb-8 grid w-full grid-cols-12 gap-3">
    <BaseInput
      @blur="updateLead"
      :label="$t('forms.address.inputs.zipcode.label')"
      :placeholder="$t('forms.address.inputs.zipcode.placeholder')"
      mask="#####-###"
      input-name="zipcode-field"
      input-id="zipcode-field"
      class="col-span-12 xl:col-span-3"
      v-model="typeAddr.zipcode"
      @input="getAddress(typeAddr.zipcode.replace('-', ''))"
      :disabled="isZipDissabled"
      :error="
        typeAddr.zipcode || hasSent
          ? !validateZip.isValidSync(typeAddr.zipcode)
          : undefined
      "
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
      v-model="typeAddr.street"
      :error="
        typeAddr.street || hasSent
          ? !validateStreet.isValidSync(typeAddr.street)
          : undefined
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
      v-model="typeAddr.number"
      :error="
        typeAddr.number || hasSent
          ? !validateNumber.isValidSync(typeAddr.number)
          : undefined
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
      v-model="typeAddr.city"
      :error="
        typeAddr.city || hasSent
          ? !validateCity.isValidSync(typeAddr.city)
          : undefined
      "
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
      v-model="typeAddr.neighborhood"
      :error="
        typeAddr.neighborhood || hasSent
          ? !validateNeighborhood.isValidSync(typeAddr.neighborhood)
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
      v-model="typeAddr.complement"
    />
    <BaseInput
      @blur="updateLead"
      :label="$t('forms.address.inputs.state.label')"
      :placeholder="$t('forms.address.inputs.state.placeholder')"
      class="col-span-12 xl:col-span-5"
      input-name="state-field"
      input-id="state-field"
      v-model="typeAddr.state"
      v-if="checkout.selectedCountry !== 'BR'"
      :error="
        typeAddr.state || hasSent
          ? !validateState.isValidSync(typeAddr.state)
          : undefined
      "
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
      v-model="typeAddr.state"
      :data="states"
      :error="
        typeAddr.state || hasSent
          ? !validateState.isValidSync(typeAddr.state)
          : undefined
      "
    >
      <template #error>
        {{ $t("checkout.address.feedbacks.state") }}
      </template>
    </BaseInput>
  </form>
</template>
