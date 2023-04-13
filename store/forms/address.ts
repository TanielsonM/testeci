import { Address, AddressState } from "@/types";

export const useAddressStore = definePiniaStore("address", {
  state: (): AddressState => ({
    sameAddress: true,
    shipping: {
      zipcode: "",
      number: 0,
      street: "",
      neighborhood: "",
      city: "",
      state: "",
      complement: "",
    },
    charge: {
      zipcode: "",
      number: 0,
      street: "",
      neighborhood: "",
      city: "",
      state: "",
      complement: "",
    },
  }),
  getters: {},
  actions: {
    setFields(form: Address, type = "charge") {
      if (type === "charge") {
        this.charge.zipcode = form.zipcode;
        this.charge.number = form.number;
        this.charge.street = form.street;
        this.charge.neighborhood = form.neighborhood;
        this.charge.city = form.city;
        this.charge.state = form.state;
        this.charge.complement = form.complement;
      } else {
        this.shipping.zipcode = form.zipcode;
        this.shipping.number = form.number;
        this.shipping.street = form.street;
        this.shipping.neighborhood = form.neighborhood;
        this.shipping.city = form.city;
        this.shipping.state = form.state;
        this.shipping.complement = form.complement;
      }
    },
  },
});
