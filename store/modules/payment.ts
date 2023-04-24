// Core
import { storeToRefs } from "pinia";
// Utils
import { GreennLogs } from "@/utils/greenn-logs";
// Types
import { Payment, Product } from "~~/types";
// Stores
import { usePersonalStore } from "../forms/personal";
import { useAddressStore } from "../forms/address";
import { usePurchaseStore } from "../forms/purchase";
import { useCheckoutStore } from "../checkout";
import { useInstallmentsStore } from "./installments";

const checkoutStore = useCheckoutStore();
const productStore = useProductStore();
const personalStore = usePersonalStore();
const addressStore = useAddressStore();
const purchaseStore = usePurchaseStore();
const installmentsStore = useInstallmentsStore();

const {
  method,
  original_amount,
  product_id,
  product_offer,
  uuid,
  captcha,
  selectedCountry,
  hasPhysicalProduct,
  product_list,
  products_client_statistics,
  hasAffiliateId,
  installments,
} = storeToRefs(checkoutStore);
const {
  is_gift,
  gift_message,
  isFixedShipping,
  hasShippingFee,
  FixedShippingAmount,
} = storeToRefs(productStore);
const { name, email, document, cellphone } = storeToRefs(personalStore);
const { charge, shipping, sameAddress } = storeToRefs(addressStore);
const { first, second } = storeToRefs(purchaseStore);
const { getInstallments } = storeToRefs(installmentsStore);

export const usePaymentStore = defineStore("Payment", {
  state: () => ({
    error: false,
  }),
  getters: {},
  actions: {
    async payment(language: string) {
      let data: Payment = {
        // Purchase infos
        method: method.value,
        amount: getInstallments.value(1),
        total: original_amount.value,
        installments: installments.value,
        // product infos
        product_id: product_id.value,
        products: product_list.value.map((item: Product) => ({
          product_id: item.id,
          product_offer: item.hash,
        })),
        // proposal_id: proposal_id,
        // User details
        name: name.value,
        email: email.value,
        cellphone: "+55" + cellphone.value,
        document: document.value,
        uuid: uuid.value,
        captcha: captcha.value,
        country_code: selectedCountry.value,
        // client_statistic: products_client_statistics.value,
        // Address
        zipcode: charge.value.zipcode
          ? charge.value.zipcode.replace(/[-]/g, "")
          : null,
        street: charge.value.street,
        number: charge.value.number,
        complement: charge.value.complement,
        neighborhood: charge.value.neighborhood,
        city: charge.value.city,
        state:
          selectedCountry.value === "US" ? document.value : charge.value.state,
        // Others
        language,
        // upsell_id: this.upsell_id,
      };
      // Gift
      if (is_gift.value) {
        data.is_gift = is_gift.value;
        data.gift_message = gift_message.value;
      }

      // Physical product
      if (hasPhysicalProduct.value()) {
        data = {
          ...data,
          shipping_address_zip_code: sameAddress.value
            ? charge.value.zipcode
            : shipping.value.zipcode,
          shipping_address_street: sameAddress.value
            ? charge.value.street
            : shipping.value.street,
          shipping_address_number: sameAddress.value
            ? charge.value.number
            : shipping.value.number,
          shipping_address_complement: sameAddress.value
            ? charge.value.complement
            : shipping.value.complement,
          shipping_address_neighborhood: sameAddress.value
            ? charge.value.neighborhood
            : shipping.value.neighborhood,
          shipping_address_city: sameAddress.value
            ? charge.value.city
            : shipping.value.city,
          shipping_address_state: sameAddress.value
            ? charge.value.state
            : shipping.value.state,
        };

        if (hasShippingFee.value && isFixedShipping.value) {
        } else {
          data.shipping_amount = FixedShippingAmount.value;
        }
      }
      // Affiliate id
      if (hasAffiliateId.value) {
        data.affiliate_id = hasAffiliateId.value;
      }

      /* When method is Credit card */
      if (
        ["CREDIT_CARD", "DEBIT_CARD", "TWO_CREDIT_CARDS"].includes(method.value)
      ) {
        let cards = [];
        cards.push({
          amount: first.value.amount,
          card_cvv: first.value.cvv,
          card_expiration_date: `${first.value.month}${first.value.year}`,
          card_holder_name: first.value.holder_name,
          card_number: first.value.number,
        });
        if (method.value === "TWO_CREDIT_CARDS") {
          cards.push({
            amount: second.value.amount,
            card_cvv: second.value.cvv,
            card_expiration_date: `${second.value.month}${second.value.year}`,
            card_holder_name: second.value.holder_name,
            card_number: second.value.number,
          });
        }

        data.cards = cards;
      }

      // Payment request
      await useApi()
        .create("/payment", data)
        .then((res) => {
          GreennLogs.logger.info("🟢 Success Compra", {
            name: "Compra concluída com sucesso",
            product_id: product_id.value,
          });
          const router = useRouter();
          router.push(`/${product_id.value}/obrigado`);
        })
        .catch((error) => {
          console.log(error);
        });
    },
  },
});
