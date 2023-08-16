interface PhoneState {
    phone: any;
}

export const usePhoneValidation = defineStore("phone", {
  state: (): PhoneState => ({
    phone: null,
  }),
  getters: {
    isValid: (state: PhoneState): boolean => state?.phone?.valid,
  },
  actions: {
    setPhone(value: any) {
      this.phone = value;
    },
  },
});
