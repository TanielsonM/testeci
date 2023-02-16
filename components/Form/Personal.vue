<script setup>
import { useCustomCheckoutStore } from "~~/stores/customCheckout";

/* Variables */
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

const personalData = ref({
  name: "",
  mail: "",
  cellphone: "",
  document: "",
});

const confirmation_mail = ref("");
const teste = () => console.log(`teste`);
</script>

<template>
  <form class="w-full grid gap-3">
    <BaseInput
      class="col-span-1"
      :label="$t('forms.personal.inputs.name.label')"
      :placeholder="$t('forms.personal.inputs.name.placeholder')"
      v-model="personalData.name"
    />
    <BaseInput
      class="col-span-1"
      :label="$t('forms.personal.inputs.mail.label')"
      :placeholder="$t('forms.personal.inputs.mail.placeholder')"
      type="email"
      v-model="personalData.mail"
    />
    <BaseInput
      class="col-span-1"
      :label="$t('forms.personal.inputs.confirmation_mail.label')"
      :placeholder="$t('forms.personal.inputs.confirmation_mail.placeholder')"
      type="email"
      :autocomplete="false"
      v-model="confirmation_mail"
      v-if="custom_checkout.hasConfirmationEmail"
    />
    <section class="flex flex-col lg:flex-row w-full gap-5">
      <BaseInput
        class="md:min-w-[350px]"
        :label="$t('forms.personal.inputs.cellphone.label')"
        :placeholder="$t('forms.personal.inputs.cellphone.placeholder')"
        v-model="personalData.cellphone"
      />
      <BaseInput
        v-if="['BR', 'MX', 'UY', 'AR', 'CL'].includes(currentCountry)"
        :label="documentText.label"
        :placeholder="documentText.placeholder"
        v-model="personalData.document"
        :mask="documentText.mask"
      />
    </section>
  </form>
</template>