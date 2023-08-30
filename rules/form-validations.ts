import * as yup from "yup";

// Stores
import { useStepStore } from "@/store/modules/steps";
import { usePhoneValidation } from "@/store/modules/phoneInput";
import { usePersonalStore } from "@/store/forms/personal";
import { useAddressStore } from "@/store/forms/address";
import { usePurchaseStore } from "@/store/forms/purchase";
import { useCheckoutStore } from "@/store/checkout";

export const validateRequired = yup.string().required();
export const validateName = yup.string().min(4).required();
export const validateEmail = yup.string().email().required();
export const validateDocument = yup
  .string()
  .test("cpfCnpj", "", (value) => validateCpfCnpj(value))
  .required();

export const validateZip = yup.string().min(5).required();
export const validateStreet = yup.string().min(4).required();
export const validateNumber = yup.string().required();
export const validateCity = yup.string().min(3).required();
export const validateNeighborhood = yup.string().min(3).required();
export const validateState = yup.string().min(2).required();

export const validateCardNumber = yup.string().max(16).required();
export const validateCvc = yup.string().min(3).max(4).required();
export const validateNameOnCard = yup.string().min(4).required();
export const validateExpiryMonth = yup.string().min(2).max(2).required();
export const validateExpiryYear = yup.string().min(4).max(4).required();
export const validateCardAmount = yup.number().positive().min(1).required();

export const validateFirstStep = async (): Promise<boolean> => {
  const personalStore = usePersonalStore();
  const phoneStore = usePhoneValidation();
  const { name, document, cellphone, email } = storeToRefs(personalStore)
  const { isValid } = storeToRefs(phoneStore)

  const validName = await validateName.isValid(name.value);
  const validEmail = await validateEmail.isValid(email.value);
  const validPhone = isValid.value;
  const currentCountry: any = useState("currentCountry");
  const showDocumentInput = ["BR", "MX", "UY", "AR", "CL"].includes(
    currentCountry.value
  );
  if (showDocumentInput) {
    const validDocument = await validateDocument.isValid(document.value);
    return validName && validEmail && validPhone && validDocument;
  }

  return validName && validEmail && validPhone;
};

export const validateSecondStep = async (): Promise<boolean> => {
  const addressStore = useAddressStore();
  const { charge, shipping, sameAddress } = storeToRefs(addressStore);

  const validZip = await validateZip.isValid(charge.value.zipcode);
  const validStreet = await validateStreet.isValid(charge.value.street);
  const validNumber = await validateNumber.isValid(charge.value.number);
  const validCity = await validateCity.isValid(charge.value.city);
  const validNeighborhood = await validateNeighborhood.isValid(charge.value.neighborhood);
  const validState = await validateState.isValid(charge.value.state);

  if (!sameAddress.value) {
    const validChargeZip = await validateZip.isValid(shipping.value.zipcode);
    const validChargeStreet = await validateStreet.isValid(shipping.value.street);
    const validChargeNumber = await validateNumber.isValid(shipping.value.number);
    const validChargeCity = await validateCity.isValid(shipping.value.city);
    const validChargeNeighborhood = await validateNeighborhood.isValid(shipping.value.neighborhood);
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
  }

  return (
    validZip &&
    validStreet &&
    validNumber &&
    validCity &&
    validNeighborhood &&
    validState
  );
};

export const validateThristStep = async (): Promise<boolean> => {
  const purchaseStore = usePurchaseStore();
  const checkout = useCheckoutStore();
  const { first, second } = storeToRefs(purchaseStore);

  if (["PIX", "BOLETO"].includes(checkout.method)) {
    return true;
  }

  const validNameOnCard = await validateNameOnCard.isValid(
    first.value.holder_name
  );
  const validCardNumber = await validateCardNumber.isValid(
    first.value.number.replace(/\s/g, "")
  );
  const validExpiryMonth = await validateExpiryMonth.isValid(first.value.month);
  const validExpiryYear = await validateExpiryYear.isValid(first.value.year);
  const validCvc = await validateCvc.isValid(first.value.cvv);
  if (checkout.method === "TWO_CREDIT_CARDS") {
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
  const stepStore = useStepStore();
  const { isMobile } = storeToRefs(stepStore);
  const validStepOne = await validateFirstStep();
  const validStepTwo = await validateSecondStep();
  const validStepThree = await validateThristStep();

  if (checkout.showAddressStep()) {
    if (
      checkout.method === "CREDIT_CARD" ||
      checkout.method === "TWO_CREDIT_CARDS" || 
      isMobile.value
    ) {
      return validStepOne && validStepTwo && validStepThree;
    }
    return validStepOne && validStepTwo;
  }

  if (
    checkout.method === "CREDIT_CARD" ||
    checkout.method === "TWO_CREDIT_CARDS"
  ) {
    return validStepOne && validStepThree;
  }
  if (checkout.method === "BOLETO" || checkout.method === "PIX") {
    const personalStore = usePersonalStore();

    const { document } = storeToRefs(personalStore);
    const validDocument = await validateDocument.isValid(document.value);
    return validStepOne && validDocument;
  }
  return validStepOne;
};

const validateCpfCnpj = (value: any) => {
  if (!value) return false;

  const cleanValue = value.replace(/[^\d]/g, "");
  if (!cleanValue) return false;

  if (cleanValue.length === 11) {
    let sum = 0;
    let remainder;

    if (cleanValue === "00000000000") return false;

    for (let i = 1; i <= 9; i++) {
      sum += Number(cleanValue.charAt(i - 1)) * (11 - i);
    }

    remainder = (sum * 10) % 11;
    if (remainder === 10 || remainder === 11) remainder = 0;
    if (remainder !== Number(cleanValue.charAt(9))) return false;

    sum = 0;
    for (let i = 1; i <= 10; i++) {
      sum += Number(cleanValue.charAt(i - 1)) * (12 - i);
    }

    remainder = (sum * 10) % 11;
    if (remainder === 10 || remainder === 11) remainder = 0;
    if (remainder !== Number(cleanValue.charAt(10))) return false;
  } else if (cleanValue.length === 14) {
    let sum = 0;
    let position = 5;
    let remainder;

    if (cleanValue === "00000000000000") return false;

    for (let i = 0; i < 12; i++) {
      sum += Number(cleanValue.charAt(i)) * position;
      position = position === 2 ? 9 : position - 1;
    }

    remainder = (sum * 10) % 11;
    if (remainder === 10 || remainder === 11) remainder = 0;
    if (remainder !== Number(cleanValue.charAt(12))) return false;

    sum = 0;
    position = 6;
    for (let i = 0; i < 13; i++) {
      sum += Number(cleanValue.charAt(i)) * position;
      position = position === 2 ? 9 : position - 1;
    }

    remainder = (sum * 10) % 11;
    if (remainder === 10 || remainder === 11) remainder = 0;
    if (remainder !== Number(cleanValue.charAt(13))) return false;
  } else {
    return false;
  }

  return true;
};

export const phoneValidation = () => {
  const personalStore = usePersonalStore();
  const { validPhone } = storeToRefs(personalStore);
  return validPhone.value;
};
