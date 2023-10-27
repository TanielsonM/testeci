import { StepState } from "~~/types";
import { usePaymentStore } from "~~/store/modules/payment";
import {
  validateFirstStep,
  validateSecondStep,
} from "@/rules/form-validations";
import { useCheckoutStore } from "~~/store/checkout";

export const useStepStore = defineStore("Step", {
  state: (): StepState => ({
    currentStep: 1,
    countSteps: 2,
    enablePaypal: false,
    format: "default",
    isMobile: false,
  }),
  getters: {
    isLastStep(state): boolean {
      return state.currentStep >= state.countSteps ? true : false;
    },
  },
  actions: {
    async setStep(step = 1) {
      const paymentStore = usePaymentStore();
      const { hasSent } = storeToRefs(paymentStore);
      hasSent.value = false;
      
      let isPersonalValid = await validateFirstStep();
      let isAddressValid = await validateSecondStep();

      if(step === 2) {
        if(isPersonalValid) {
          this.currentStep = step;
        }
      } else if(step === 3) {
        if(isPersonalValid && isAddressValid) {
          this.currentStep = step;
        }
      } else {
        this.currentStep = step;
      }
    },
    async changePaypalStatus() {
      const checkoutStore = useCheckoutStore();
      const { showAddressStep } = storeToRefs(checkoutStore);
      let isPersonalValid = await validateFirstStep();
      let isAddressValid = await validateSecondStep();
      if (isPersonalValid && (!showAddressStep.value || (showAddressStep.value && isAddressValid))) {
        this.enablePaypal = true;
      } else {
        this.enablePaypal = false;
      }
    },
    setFormat(format: "default" | "one_step") {
      this.format = format;
    },
    setCurrentStep(step: number) {
      this.currentStep = step;
    },
    next() {
      this.currentStep++;
    },
    back() {
      this.currentStep--;
    },
    incrementCount() {
      this.countSteps++;
    },
    decreaseCount() {
      this.countSteps--;
    },
  },
});
