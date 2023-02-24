<script setup>
import { storeToRefs } from "pinia";
import { useCustomCheckoutStore } from "~~/store/customCheckout";
import { usePersonalStore } from "@/store/forms/personal";

/* Variables */
const personalStore = usePersonalStore();
const custom_checkout = useCustomCheckoutStore();
const currentCountry = useState("currentCountry");
const documentText = computed(() => {
  switch (currentCountry.value) {
    case "AR":
      return {
        label: "CUIT/CUIL o DNI",
        placeholder: "CUIT/CUIL o DNI",
        mask: ["#####################"],
      };
    case "MX":
      return {
        label: "Número RFC",
        placeholder: "Número RFC",
        mask: ["########################"],
      };
    case "UY":
      return {
        label: "Número CI",
        placeholder: "Número CI",
        mask: ["########################"],
      };
    case "CL":
      return {
        label: "Añadir RUT",
        placeholder: "Añadir RUT",
        mask: ["#####################"],
      };
    default:
      return {
        label: "CPF ou CNPJ",
        placeholder: "Doc. do títular da compra",
        mask: ["###.###.###-##", "##.###.###/####-##"],
      };
  }
});

const { name, email, cellphone, document } = storeToRefs(personalStore);

const confirmation_mail = ref("");
</script>

<template>
  <form class="grid w-full grid-cols-12 gap-3">
    <BaseInput
      class="col-span-12"
      :label="$t('forms.personal.inputs.name.label')"
      :placeholder="$t('forms.personal.inputs.name.placeholder')"
      v-model="name"
    />
    <BaseInput
      class="col-span-12"
      :label="$t('forms.personal.inputs.mail.label')"
      :placeholder="$t('forms.personal.inputs.mail.placeholder')"
      type="email"
      v-model="email"
    />
    <BaseInput
      class="col-span-12"
      :label="$t('forms.personal.inputs.confirmation_mail.label')"
      :placeholder="$t('forms.personal.inputs.confirmation_mail.placeholder')"
      type="email"
      :autocomplete="false"
      v-model="confirmation_mail"
      v-if="custom_checkout.hasConfirmationEmail"
    />
    <BaseInput
      class="col-span-12 xl:col-span-6"
      :label="$t('forms.personal.inputs.cellphone.label')"
      :placeholder="$t('forms.personal.inputs.cellphone.placeholder')"
      v-model="cellphone"
      type="tel"
    />
    <BaseInput
      class="col-span-12 xl:col-span-6"
      v-if="['BR', 'MX', 'UY', 'AR', 'CL'].includes(currentCountry)"
      :label="documentText.label"
      :placeholder="documentText.placeholder"
      v-model="document"
      :mask="documentText.mask"
    />
  </form>
</template>
