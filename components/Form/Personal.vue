<script setup>
import { useCustomCheckoutStore } from "~~/store/customCheckout";
import { usePersonalStore } from "@/store/forms/personal";
import { useLeadsStore } from "@/store/modules/leads";
import { usePaymentStore } from "@/store/modules/payment";
import { useStepStore } from "@/store/modules/steps";

import {
  validateFirstStep,
  validateSecondStep,
  validateName,
  validateEmail,
  validateDocument,
  phoneValidation,
  validateRequired,
} from "@/rules/form-validations";

/* Variables */
const leadsStore = useLeadsStore();
const personalStore = usePersonalStore();
const custom_checkout = useCustomCheckoutStore();
const currentCountry = useState("currentCountry");
const payment = usePaymentStore();
const stepStore = useStepStore();

const { hasSent } = storeToRefs(payment);

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
        placeholder: "Doc. do titular da compra",
        documentMask:
          document.value.length <= 14 ? "###.###.###-##" : "##.###.###/####-##",
      };
  }
});

const {
  name,
  email,
  cellphone,
  document,
  confirmEmail,
  forceName,
  forceEmail,
  forceConfirmEmail,
  forceDocument,
  forceCellphone,
} = storeToRefs(personalStore);

watch([name, email, cellphone, document], async () => {
  
  leadsStore.syncPersonal();
  let isPersonalValid = await validateFirstStep();
  let isAddressValid = await validateSecondStep();
  let currentStep = stepStore.currentStep;

  stepStore.changePaypalStatus();

  if (isPersonalValid) {
    if (isAddressValid) {
      if (currentStep === 1 || currentStep === 2) {
        stepStore.setCurrentStep(2);
      }
    } else if (!isPersonalValid && !isAddressValid && currentStep === 2) {
      stepStore.back();
    } else if (isPersonalValid && !isAddressValid && currentStep === 3) {
      stepStore.back();
    }
  }
});

function updateLead(isEmail = false) {
  if (isEmail) email.value = email.value.trim();
  setTimeout(function () {
    leadsStore.updateLead();
  }, 1000);
}

personalStore.setFields(useRoute().query);
</script>

<template>
  <VeeForm class="grid w-full grid-cols-12 gap-3" ref="personal-form">
    <BaseInput
      @blur="updateLead"
      class="col-span-12"
      :label="$t('forms.personal.inputs.name.label')"
      :placeholder="$t('forms.personal.inputs.name.placeholder')"
      input-name="name-field"
      input-id="name-field"
      v-model="name"
      :error="name || hasSent ? !validateName.isValidSync(name) : undefined"
      :disabled="forceName"
    >
      <template #error>
        {{ $t("checkout.dados_pessoais.feedbacks.nome") }}
      </template>
    </BaseInput>

    <BaseInput
      class="col-span-12"
      @blur="updateLead(true)"
      :label="$t('forms.personal.inputs.mail.label')"
      :placeholder="$t('forms.personal.inputs.mail.placeholder')"
      input-name="email-field"
      input-id="email-field"
      v-model="email"
      :error="email && hasSent ? !validateEmail.isValidSync(email) : undefined"
      :disabled="forceEmail"
    >
      <template #error>
        {{ $t("checkout.dados_pessoais.feedbacks.email") }}
      </template>
    </BaseInput>

    <BaseInput
      class="col-span-12"
      @blur="updateLead"
      :label="$t('forms.personal.inputs.confirmation_mail.label')"
      :placeholder="$t('forms.personal.inputs.confirmation_mail.placeholder')"
      type="email"
      :autocomplete="false"
      input-name="confirmation_mail-field"
      input-id="confirmation_mail-field"
      v-model="confirmEmail"
      v-if="custom_checkout.hasConfirmationEmail"
      :error="confirmEmail || hasSent ? !(confirmEmail === email) : undefined"
      :disabled="forceConfirmEmail"
    >
      <template #error>
        {{ $t("checkout.dados_pessoais.feedbacks.confirmation_email") }}
      </template>
    </BaseInput>

    <BasePhone
      class="col-span-12"
      @blur="updateLead"
      :class="{ 'xl:col-span-6': showDocumentInput }"
      :label="$t('forms.personal.inputs.cellphone.label')"
      :placeholder="$t('forms.personal.inputs.cellphone.placeholder')"
      input-name="cellphone-field"
      input-id="cellphone-field"
      v-model="cellphone"
      type="tel"
      :error="cellphone || hasSent ? !phoneValidation() : undefined"
      :disabled="forceCellphone"
    >
      <template #error>
        {{ $t("checkout.dados_pessoais.feedbacks.celular") }}
      </template>
    </BasePhone>
    <BaseInput
      class="col-span-12"
      @blur="updateLead"
      :class="{ 'xl:col-span-6': showDocumentInput }"
      :label="documentText.label"
      :placeholder="documentText.placeholder"
      v-if="showDocumentInput"
      input-name="document-field"
      input-id="document-field"
      v-model="document"
      :mask="documentText.documentMask"
      :error="
        document || hasSent
          ? currentCountry === 'BR'
            ? !validateDocument.isValidSync(document)
            : !validateRequired.isValidSync(document)
          : undefined
      "
      :disabled="forceDocument"
    >
      <template #error>
        {{ $t("checkout.dados_pessoais.feedbacks.document") }}
      </template>
    </BaseInput>
  </VeeForm>
</template>
