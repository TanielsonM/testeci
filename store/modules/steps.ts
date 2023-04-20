import { StepState } from "~~/types";

export const useStepStore = defineStore("Step", {
  state: (): StepState => ({
    step: 1,
    format: "default",
  }),
  actions: {
    setStep(step = 1) {
      this.step = step;
    },
    setFormat(format: "default" | "one_step") {
      this.format = format;
    },
  },
});
