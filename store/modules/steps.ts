import { StepState } from "~~/types";
import { usePaymentStore } from "~~/store/modules/payment";
import {
  validateFirstStep,
  validateSecondStep,
} from "@/rules/form-validations";

export const useStepStore = defineStore("Step", {
  state: (): StepState => ({
    currentStep: 1,
    format: "default",
    isMobile: false,
    countSteps: 2,
  }),
  actions: {
    async setStep(step = 1) {
      const paymentStore = usePaymentStore();
      const { hasSent } = storeToRefs(paymentStore);

      switch (step) {
        case 2:
          let validateOne = await validateFirstStep();
          if (!validateOne) {
            hasSent.value = true;
            return;
          }
          break;
        case 3:
          let validateSecond = await validateSecondStep();
          if (!validateSecond) {
            hasSent.value = true;
            return;
          }
          break;
      }
      hasSent.value = false;
      this.currentStep = step;
    },
    setFormat(format: "default" | "one_step") {
      this.format = format;
    },
    back() {
      this.currentStep--;
    },
    incrementCount() {
      this.countSteps++;
    },
  },
});
