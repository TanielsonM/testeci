import { type StepState } from "~~/types";
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
    isEmailValid: false
  }),
  getters: {
    getCountSteps():number {
      const checkout = useCheckoutStore();
      const { showAddressStep } = storeToRefs(checkout);
      if(showAddressStep.value){
        return 3;
      }
      return 2;
    },
    isLastStep(state): boolean {
      return state.currentStep >= this.getCountSteps ? true : false;
    },
  },
  actions: {
    async setStep(step = 1) {
      const paymentStore = usePaymentStore();
      const { hasSent } = storeToRefs(paymentStore);
      
      let isPersonalValid = await validateFirstStep();
      let isAddressValid = await validateSecondStep();

      if(step === 2) {
        if(isPersonalValid) {
          this.currentStep = step;
          hasSent.value = false;
        } else {
          hasSent.value = true;
        }
      } else if(step === 3) {
        if(isPersonalValid && isAddressValid) {
          this.currentStep = step;
          hasSent.value = false;
        } else {
          hasSent.value = true;
        }
      } else {
        this.currentStep = step;
        hasSent.value = false;
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
    setIsEmailValid(value: boolean) {
      this.isEmailValid = value;
    },
    next() {
      this.currentStep++;
    },
    back() {
      this.currentStep = this.currentStep - 1;
    },
    incrementCount() {
      this.countSteps++;
    },
    decreaseCount() {
      this.countSteps--;
    },
  },
});
