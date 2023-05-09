import { StepState } from "~~/types";
import { useLeadsStore } from "~~/store/modules/leads";
const leadsStore = useLeadsStore();
const { step } = storeToRefs(leadsStore);

export const useStepStore = defineStore("Step", {
  state: (): StepState => ({
    currentStep: step.value,
    format: "default",
    isMobile: false,
    countSteps: 0,
  }),
  actions: {
    setStep(step = 1) {
      this.currentStep = step;
    },
    setFormat(format: "default" | "one_step") {
      this.format = format;
    },
    incrementCount() {
      this.countSteps++;
    },
  },
});

const stepStore = useStepStore();

watch(
  () => leadsStore.step,
  (newVal) => {
    stepStore.currentStep = newVal;
  }
);
