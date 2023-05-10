import * as yup from "yup";

// Stores
import { usePersonalStore } from "@/store/forms/personal";
import { useAddressStore } from "@/store/forms/address";
import { usePurchaseStore } from "@/store/forms/purchase";

export const validateName = yup.string().min(4).required();
export const validateEmail = yup.string().email().required();
export const validateConfirmEmail = yup
  .string()
  .required()
  .oneOf([yup.ref("email-field")]);
export const validatePhone = yup.string().min(8).required();
export const validateDocument = yup.string().required();

export const validateZip = yup.string().min(5).required();
export const validateStreet = yup.string().min(4).required();
export const validateNumber = yup.string().required();
export const validateCity = yup.string().min(5).required();
export const validateNeighborhood = yup.string().min(3).required();
export const validateState = yup.string().min(2).required();

export const validateAll = async (): Promise<boolean> => {
  const personalStore = usePersonalStore();
  const addressStore = useAddressStore();
  const purchaseStore = usePurchaseStore();

  const { name, email, document, cellphone } = storeToRefs(personalStore);
  const { charge, shipping, sameAddress } = storeToRefs(addressStore);
  const { first, second } = storeToRefs(purchaseStore);

  const validName = await validateName.isValid(name);
  const validEmail = await validateEmail.isValid(email);
  const validPhone = await validatePhone.isValid(cellphone);
  const validDocument = await validateDocument.isValid(document);

  return validName && validEmail && validPhone && validDocument;
};
