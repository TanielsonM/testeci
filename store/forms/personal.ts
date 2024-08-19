interface Fields {
  fn: string | undefined;
  em: string | undefined;
  ph: string | undefined;
  document: string | undefined;
  force: string | undefined;
}

import { defineStore } from "pinia";
import { validateFirstStep, validateFirstStepWithoutDocument } from "~/rules/form-validations";

export const usePersonalStore = defineStore("personal", {
  state: () => ({
    name: "",
    email: "",
    confirmEmail: "",
    cellphone: "",
    document: "",
    validPhone: false,
    // Force url data
    force: false,
    forceName: false,
    forceEmail: false,
    forceConfirmEmail: false,
    forceCellphone: false,
    forceDocument: false,
    isFormValid: false,
    isFormValidWithoutDocument: false
  }),
  getters: {
    getValueFirstStep: async () => {
      return await validateFirstStep();
    },
    isPersonalFormValid: (state) => state.isFormValid,
    getValueFirstStepWithoutDocument: async () => {
      return await validateFirstStepWithoutDocument();
    },
    isPersonalFormValidWithoutDocument: (state) => state.isFormValidWithoutDocument,
  },
  actions: {
    setFields(fields: Fields) {
      this.force = fields.force === "true";
      if (fields?.fn) {
        this.name = decodeURI(fields.fn);
        this.forceName = this.force;
      }
      if (fields?.em) {
        this.email = decodeURI(fields.em);
        this.forceEmail = this.force;
      }
      if (fields?.em) {
        this.confirmEmail = decodeURI(fields.em);
        this.forceConfirmEmail = this.force;
      }
      if (fields?.ph) {
        this.cellphone = fields.ph;
        this.forceCellphone = this.force;
      }
      if (fields?.document) {
        this.document = fields.document;
        this.forceDocument = this.force;
      }
    },
    setIsFormValid(value: boolean){      
      this.isFormValid = value;
    },
    setIsFormValidWithoutDocument(value: boolean){      
      this.isFormValidWithoutDocument = value;
    }
  },
});
