interface Fields {
  fn: string | undefined;
  email: string | undefined;
  cellphone: string | undefined;
  document: string | undefined;
  force: string | undefined;
}

import { defineStore } from "pinia";

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
  }),
  getters: {},
  actions: {
    setFields(fields: Fields) {
      this.force = fields.force === "true";
      if (fields?.fn) {
        this.name = fields.fn;
        this.forceName = this.force;
      }
      if (fields?.email) {
        this.email = fields.email;
        this.forceEmail = this.force;
      }
      if (fields?.email) {
        this.confirmEmail = fields.email;
        this.forceConfirmEmail = this.force;
      }
      if (fields?.cellphone) {
        this.cellphone = fields.cellphone;
        this.forceCellphone = this.force;
      }
      if (fields?.document) {
        this.document = fields.document;
        this.forceDocument = this.force;
      }
    },
  },
});
