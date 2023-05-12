import * as yup from "yup";

// Stores
import { usePersonalStore } from "@/store/forms/personal";
import { useAddressStore } from "@/store/forms/address";
import { usePurchaseStore } from "@/store/forms/purchase";
import { useCheckoutStore } from "~~/store/checkout";

const personalStore = usePersonalStore();
const { email } = storeToRefs(personalStore);

export const validateName = yup.string().min(4).required();
export const validateEmail = yup.string().email().required();
export const validatePhone = yup.string().min(8).required();
export const validateDocument = yup.string().required();

export const validateZip = yup.string().min(5).required();
export const validateStreet = yup.string().min(4).required();
export const validateNumber = yup.string().required();
export const validateCity = yup.string().min(5).required();
export const validateNeighborhood = yup.string().min(3).required();
export const validateState = yup.string().min(2).required();

export const validateCardNumber = yup.string().max(16).required();
export const validateCvc = yup.string().min(3).max(4).required();
export const validateNameOnCard = yup.string().required();
export const validateExpiryMonth = yup.string().min(2).max(2).required();
export const validateExpiryYear = yup.string().min(4).max(4).required();

export const validateFirstStep = (): boolean => {
  const { name, document, cellphone } = storeToRefs(personalStore);

  const validName = validateName.isValidSync(name.value);
  const validEmail = validateEmail.isValidSync(email.value);
  const validPhone = validatePhone.isValidSync(cellphone.value);
  const validDocument = validateDocument.isValidSync(document.value);

  return validName && validEmail && validPhone && validDocument;
};

export const validateSecondStep = async (): Promise<boolean> => {
  const addressStore = useAddressStore();
  const { charge, shipping, sameAddress } = storeToRefs(addressStore);

  const validZip = await validateZip.isValid(charge.value.zipcode);
  const validStreet = await validateStreet.isValid(charge.value.street);
  const validNumber = await validateNumber.isValid(charge.value.number);
  const validCity = await validateCity.isValid(charge.value.city);
  const validNeighborhood = await validateNeighborhood.isValid(
    charge.value.neighborhood
  );
  const validState = await validateState.isValid(charge.value.state);

  if (!sameAddress.value) {
    const validChargeZip = await validateZip.isValid(shipping.value.zipcode);
    const validChargeStreet = await validateStreet.isValid(
      shipping.value.street
    );
    const validChargeNumber = await validateNumber.isValid(
      shipping.value.number
    );
    const validChargeCity = await validateCity.isValid(shipping.value.city);
    const validChargeNeighborhood = await validateNeighborhood.isValid(
      shipping.value.neighborhood
    );
    const validChargeState = await validateState.isValid(shipping.value.state);

    return (
      validZip &&
      validStreet &&
      validNumber &&
      validCity &&
      validNeighborhood &&
      validState &&
      validChargeZip &&
      validChargeStreet &&
      validChargeNumber &&
      validChargeCity &&
      validChargeNeighborhood &&
      validChargeState
    );
  } else {
    return (
      validZip &&
      validStreet &&
      validNumber &&
      validCity &&
      validNeighborhood &&
      validState
    );
  }
};

export const validateThristStep = async (): Promise<boolean> => {
  const purchaseStore = usePurchaseStore();
  const { first, second } = storeToRefs(purchaseStore);

  const validNameOnCard = await validateNameOnCard.isValid(
    first.value.holder_name
  );
  const validCardNumber = await validateCardNumber.isValid(
    first.value.number.replace(/\s/g, "")
  );
  const validExpiryMonth = await validateExpiryMonth.isValid(first.value.month);
  const validExpiryYear = await validateExpiryYear.isValid(first.value.year);
  const validCvc = await validateCvc.isValid(first.value.cvv);

  if (!!second.value.number) {
    const validNameOnCardSecond = await validateNameOnCard.isValid(
      second.value.holder_name
    );
    const validCardNumberSecond = await validateCardNumber.isValid(
      second.value.number.replace(/\s/g, "")
    );
    const validExpiryMonthSecond = await validateExpiryMonth.isValid(
      second.value.month
    );
    const validExpiryYearSecond = await validateExpiryYear.isValid(
      second.value.year
    );
    const validCvcSecond = await validateCvc.isValid(second.value.cvv);

    return (
      validNameOnCard &&
      validCardNumber &&
      validExpiryMonth &&
      validExpiryYear &&
      validExpiryMonthSecond &&
      validExpiryYearSecond &&
      validCvcSecond &&
      validCvc &&
      validNameOnCardSecond &&
      validCardNumberSecond
    );
  }

  return (
    validNameOnCard &&
    validCardNumber &&
    validExpiryMonth &&
    validExpiryYear &&
    validCvc
  );
};

export const validateAll = async (): Promise<boolean> => {
  const checkout = useCheckoutStore();
  const validStepOne = await validateFirstStep();
  const validStepTwo = await validateSecondStep();
  const validStepThree = await validateThristStep();

  if (checkout.showAddressStep()) {
    return validStepOne && validStepTwo && validStepThree;
  }

  return validStepOne && validStepThree;
};
