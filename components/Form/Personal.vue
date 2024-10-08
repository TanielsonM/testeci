<script setup>
import { useCustomCheckoutStore } from "~~/store/customCheckout";
import { usePersonalStore } from "@/store/forms/personal";
import { useLeadsStore } from "@/store/modules/leads";
import { usePaymentStore } from "@/store/modules/payment";
import { useStepStore } from "@/store/modules/steps";
import { defineProps } from 'vue';

import {
  validateFirstStepWithoutDocument,
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
const props = defineProps({
  urlSubscription:{
    type: Boolean,
    default: false
  },
});

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

const { isEmailValid } = storeToRefs(stepStore);
const queryParams = useRoute().query;

watch([name, email, cellphone, document], async () => {
  
  leadsStore.syncPersonal();
  await validateFirstStepWithoutDocument();
  let isPersonalValid = await validateFirstStep();
  let isAddressValid = await validateSecondStep();
  let currentStep = stepStore.currentStep;

  stepStore.changePaypalStatus();

  if (isPersonalValid) {
    if (!isPersonalValid && !isAddressValid && currentStep === 2) {
      stepStore.back();
    } else if (isPersonalValid && !isAddressValid && currentStep === 3) {
      stepStore.back();
    }
  }
});

function validateEmailWithVeeValidate(validateField) {
  validateField('email-field').then(res => {
    stepStore.setIsEmailValid(res.valid)
  })
}

async function allBlurInputEvent(isEmail = false) {
  if (isEmail) email.value = email.value.trim();
  let step = await validateFirstStep(true) 
  personalStore.setIsFormValid(step)
  setTimeout(function () {
    leadsStore.updateLead();
  }, 1000);
}

personalStore.setFields(queryParams);

const personalForm = ref(null);

onMounted(() => {
  if(queryParams.em) {
    personalForm.value.setFieldValue('email-field', decodeURI(queryParams.em));
    personalForm.value.validateField('email-field').then(res => {
      stepStore.setIsEmailValid(res.valid)
    })
  }
})
</script>

<template>
  <VeeForm class="grid w-full grid-cols-12 gap-3" ref="personalForm" v-slot="{ validateField }">
    <BaseInput
      @blur="allBlurInputEvent"
      class="col-span-12"
      :label="$t('forms.personal.inputs.name.label')"
      :placeholder="$t('forms.personal.inputs.name.placeholder')"
      input-name="name-field"
      input-id="name-field"
      v-model="name"
      :error="name || hasSent ? !validateName.isValidSync(name) : undefined"
      :disabled="forceName || urlSubscription"
    >
      <template #error>
        {{ $t("checkout.dados_pessoais.feedbacks.nome") }}
      </template>
    </BaseInput>

    <BaseInput
      type="email"
      class="col-span-12"
      @change="validateEmailWithVeeValidate(validateField)"
      @blur="allBlurInputEvent(true)"
      :label="$t('forms.personal.inputs.mail.label')"
      :placeholder="$t('forms.personal.inputs.mail.placeholder')"
      input-name="email-field"
      input-id="email-field"
      v-model="email"
      v-if="!urlSubscription"
      :error="!email && hasSent ||email && hasSent ? (!validateEmail.isValidSync(email) || (!!queryParams.em && !isEmailValid)) : undefined"
      :disabled="forceEmail"
      rules="email"
    >
      <template #error>
        {{ $t("checkout.dados_pessoais.feedbacks.email") }}
      </template>
    </BaseInput>

    <BaseInput
      class="col-span-12"
      @blur="allBlurInputEvent"
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
      @blur="allBlurInputEvent"
      :class="{ 'xl:col-span-6': showDocumentInput }"
      :label="$t('forms.personal.inputs.cellphone.label')"
      :placeholder="$t('forms.personal.inputs.cellphone.placeholder')"
      input-name="cellphone-field"
      input-id="cellphone-field"
      v-model="cellphone"
      type="tel"
      v-if="!urlSubscription"
      :error="cellphone || hasSent ? !phoneValidation() : undefined"
      :disabled="forceCellphone"
    >
      <template #error>
        {{ $t("checkout.dados_pessoais.feedbacks.celular") }}
      </template>
    </BasePhone>
    <BaseInput
      class="col-span-12"
      @blur="allBlurInputEvent"
      :class="{ 'xl:col-span-6': showDocumentInput && !urlSubscription }"
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
      :disabled="forceDocument || urlSubscription"
    >
      <template #error>
        {{ $t("checkout.dados_pessoais.feedbacks.document") }}
      </template>
    </BaseInput>
  </VeeForm>
</template>
