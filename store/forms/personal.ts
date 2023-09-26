interface Fields {
  fn: string | undefined;
  em: string | undefined;
  ph: string | undefined;
  document: string | undefined;
  force: string | undefined;
}
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
      if (fields?.em) {
        this.email = fields.em;
        this.forceEmail = this.force;
      }
      if (fields?.em) {
        this.confirmEmail = fields.em;
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
  },

});
