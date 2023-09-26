import { StepState } from "~~/types";
import { usePaymentStore } from "~~/store/modules/payment";
import {
  validateFirstStep,
  validateSecondStep,
} from "@/rules/form-validations";

export const useStepStore = defineStore("Step", {
  state: (): StepState => ({
    currentStep: 1,
    countSteps: 2,
    enablePaypal: false,
    format: "default",
    isMobile: false,
  }),

  actions: {
    async setStep(step = 1) {
      const paymentStore = usePaymentStore();
      const { hasSent } = storeToRefs(paymentStore);

      switch (step) {
        case 2:
          let validateOne = await validateFirstStep();

          if (!validateOne) {
            this.enablePaypal = true;
            hasSent.value = true;
            return;
          }

          this.enablePaypal = false;
          break;

        case 3:
          let validateSecond = await validateSecondStep();

          if (!validateSecond) {
            this.enablePaypal = true;
            hasSent.value = true;
            return;
          }

          this.enablePaypal = false;
          break;
      }
      hasSent.value = false;
      this.currentStep = step;
    },
    changePaypalStep(value: boolean) {
      this.enablePaypal = value;
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
