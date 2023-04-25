<script setup>
import { storeToRefs } from "pinia";
import { useCustomCheckoutStore } from "~~/store/customCheckout";
import { usePersonalStore } from "@/store/forms/personal";
import { useLeadsStore } from "@/store/modules/leads";

/* Variables */
const leadsStore = useLeadsStore();
const personalStore = usePersonalStore();
const custom_checkout = useCustomCheckoutStore();
const currentCountry = useState("currentCountry");

const showDocumentInput = ["BR", "MX", "UY", "AR", "CL"].includes(
  currentCountry.value
);

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
        documentMask: ["########################"],
      };
    case "UY":
      return {
        label: "Número CI",
        placeholder: "Número CI",
        documentMask: ["########################"],
      };
    case "CL":
      return {
        label: "Añadir RUT",
        placeholder: "Añadir RUT",
        documentMask: ["#####################"],
      };
    default:
      return {
        label: "CPF ou CNPJ",
        placeholder: "Doc. do títular da compra",
        mask:
          document.value.length <= 14 ? "###.###.###-##" : "##.###.###/####-##",
      };
  }
});

const { name, email, cellphone, document } = storeToRefs(personalStore);
const confirmation_mail = ref("");
</script>

<template>
  <VeeForm class="grid w-full grid-cols-12 gap-3" ref="personal-form">
    <BaseInput
      class="col-span-12"
      :label="$t('forms.personal.inputs.name.label')"
      :placeholder="$t('forms.personal.inputs.name.placeholder')"
      input-name="name-field"
      v-model="name"
      rules="required"
    >
      <template #error>
        {{ $t("checkout.dados_pessoais.feedbacks.nome") }}
      </template>
    </BaseInput>

    <BaseInput
      class="col-span-12"
      :label="$t('forms.personal.inputs.confirmation_mail.label')"
      :placeholder="$t('forms.personal.inputs.confirmation_mail.placeholder')"
      type="email"
      :autocomplete="false"
      input-name="confirmation_mail-field"
      v-model="confirmation_mail"
      rules="required|email|confirmed:@email-field"
      v-if="custom_checkout.hasConfirmationEmail"
    >
      <template #error>
        {{ $t("checkout.dados_pessoais.feedbacks.confirmation_email") }}
      </template>
    </BaseInput>

    <BaseInput
      class="col-span-12"
      :class="{ 'xl:col-span-6': showDocumentInput }"
      :label="$t('forms.personal.inputs.cellphone.label')"
      :placeholder="$t('forms.personal.inputs.cellphone.placeholder')"
      input-name="cellphone-field"
      v-model="cellphone"
      :mask="numberMask.mask"
      :rules="{
        required: true,
        regex: /^[\+]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4,6}$/,
      }"
      type="tel"
    >
      <template #error>
        {{ $t("checkout.dados_pessoais.feedbacks.celular") }}
      </template>
    </BaseInput>

    <BaseInput
      class="col-span-12"
      :class="{ 'xl:col-span-6': showDocumentInput }"
      :label="documentText.label"
      :placeholder="documentText.placeholder"
      v-if="showDocumentInput"
      input-name="document-field"
      v-model="document"
      :mask="documentText.documentMask"
      rules="required|number"
    >
      <template #error>
        {{ $t("checkout.dados_pessoais.feedbacks.document") }}
      </template>
    </BaseInput>
  </VeeForm>
</template>
