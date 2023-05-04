// Utils
import { GreennLogs } from "@/utils/greenn-logs";

// Types
import { Payment, Product, PaymentError, SaleElement } from "~~/types";

// Stores
import { usePersonalStore } from "../forms/personal";
import { useAddressStore } from "../forms/address";
import { usePurchaseStore } from "../forms/purchase";
import { useLeadsStore } from "../modules/leads";
import { useCheckoutStore } from "../checkout";
import { useInstallmentsStore } from "./installments";
import { useAmountStore } from "./amount";

const leadsStore = useLeadsStore();
const checkoutStore = useCheckoutStore();
const productStore = useProductStore();
const personalStore = usePersonalStore();
const addressStore = useAddressStore();
const purchaseStore = usePurchaseStore();
const installmentsStore = useInstallmentsStore();
const amountStore = useAmountStore();

const {
  method,
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
  coupon,
  hasUpsell,
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
const { getOriginalAmount } = storeToRefs(amountStore);

export const usePaymentStore = defineStore("Payment", {
  state: () => ({
    error: false,
  }),
  getters: {},
  actions: {
    async payment(language: string, paypal: any) {
      leadsStore.changeStep(3);

      let data: Payment = {
        // Purchase infos
        method: method.value,
        amount: getInstallments.value(1),
        total: getOriginalAmount.value,
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
        upsell_id: hasUpsell.value,
      };

      if (method.value === "PAYPAL") {
        data.paypal = paypal;
      }

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

      // Coupon
      if (coupon.value.applied && !!coupon.value.name) {
        data.products[0].coupon = coupon.value.name.toUpperCase();
      }

      /* When method is Credit card */
      if (
        ["CREDIT_CARD", "DEBIT_CARD", "TWO_CREDIT_CARDS"].includes(method.value)
      ) {
        let cards = [];
        cards.push({
          amount: parseFloat(
            first.value.amount
              .toString()
              .replace("R$ ", "")
              .replace(",", ".")
              .replace("-", "")
          ),
          card_cvv: first.value.cvv,
          card_expiration_date: `${first.value.month}${first.value.year}`,
          card_holder_name: first.value.holder_name,
          card_number: first.value.number,
        });
        if (method.value === "TWO_CREDIT_CARDS") {
          cards.push({
            amount: parseFloat(
              second.value.amount
                .toString()
                .replace("R$ ", "")
                .replace(",", ".")
                .replace("-", "")
            ),
            card_cvv: second.value.cvv,
            card_expiration_date: `${second.value.month}${second.value.year}`,
            card_holder_name: second.value.holder_name,
            card_number: second.value.number,
          });
        }

        data.cards = cards;
      }

      const allowed_installments = ["CREDIT_CARD", "TWO_CREDIT_CARD"];
      if (!allowed_installments.includes(method.value)) {
        delete data.installments;
      }

      // Registrando log boleto
      let dataLog = Object.assign({}, data);

      GreennLogs.logger.info("🟡 Dados da Compra", {
        name: `Enviando objeto da compra [${method.value}]`,
        objetoCompra: JSON.stringify(dataLog),
      });

      checkoutStore.setLoading(true);
      // Payment request
      await useApi()
        .create("/payment", data)
        .then((res) => {
          if (
            res.sales !== undefined &&
            Array.isArray(res.sales) &&
            res.sales.every((item: SaleElement) => item.success)
          ) {
            GreennLogs.logger.info("🟢 Success Compra", {
              name: "Compra concluída com sucesso",
              product_id: product_id.value,
            });
            const query: any = {};
            if (res.sales[0]?.chc) query.chc = res.sales[0].chc;
            if (res.sales[0]?.token) query.token = res.sales[0].token;
            if (res.sales[0]?.sale_id) {
              delete query.chc;
              delete query.token;
              query.s_id = res.sales[0].sale_id;
            }
            if (!!product_offer.value) query.offer = product_offer.value;

            const router = useRouter();
            router.push({
              path: `/${product_id.value}/obrigado`,
              query,
            });

            return;
          }
          if (res.status === "error" && !res.sales?.success) {
            this.validateError(res);
            return;
          }
        })
        .catch((error) => {
          console.log(error);
          checkoutStore.setLoading(false);
        });
    },
    validateError(error: PaymentError) {
      checkoutStore.setLoading(false);
      const { t } = useI18n();
      let error_message = "";
      switch (error.code) {
        case "0001":
          error_message = t("error.0001");
          // this.resetCheckout("CARD");
          break;
        case "BANK":
          error_message = t("error.BANK");
          // this.resetCheckout("ALL");
          break;
        case "BLACKLIST_PURCHASE":
          error_message = t("error.BLACKLIST_PURCHASE");
          // this.resetCheckout("ALL");
          break;
        case "INVALID_CVV":
          error_message = t("error.INVALID_CVV");
          // this.resetCheckout("CVV");
          break;
        case "INVALID_CLIENT_DATA":
          error_message = t("error.INVALID_CLIENT_DATA");
          // this.resetCheckout("ALL");
          break;
        case "DUPLICATE_PURCHASE":
          error_message = t("error.DUPLICATE_PURCHASE");
          // this.resetCheckout("ALL");
          break;
        case "PRODUCT_OUT_OF_STOCK":
          error_message = t("error.PRODUCT_OUT_OF_STOCK");
          // this.resetCheckout("ALL");
          break;
        case "CREDIT_CARD_OPERATOR":
          error_message = t("error.CREDIT_CARD_OPERATOR");
          // this.resetCheckout("ALL");
          break;
        case "INVALID_DATA":
          error_message = t("error.INVALID_DATA");
          // this.resetCheckout("CARD");
          break;
        case "INVALID_CREDIT_CARD":
          error_message = t("error.INVALID_CREDIT_CARD");
          // this.resetCheckout("ALL");
          break;
        case "INSUFFICIENT_FUNDS":
          error_message = t("error.INSUFFICIENT_FUNDS");
          // this.resetCheckout("CARD");
          break;
        case "INVALID_PAYMENT_TYPE":
          error_message = t("error.INVALID_PAYMENT_TYPE");
          // this.resetCheckout("ALL");
          break;
        case "INVALID_INSTALLMENTS":
          error_message = t("error.INVALID_INSTALLMENTS");
          // this.resetCheckout("CARD");
          break;
        case "INVALID_INSTALLMENTS_BUMP":
          error_message = t("error.INVALID_INSTALLMENTS_BUMP");
          // this.resetCheckout("CARD");
          break;
        case "CURRENCY_NOT_SUPPORTED":
          error_message = t("error.CURRENCY_NOT_SUPPORTED");
          // this.resetCheckout("CARD");
          break;
        case "SUSPECTED_FRAUD":
          error_message = t("error.SUSPECTED_FRAUD");
          // this.resetCheckout("ALL");
          break;
        case "EXPIRED_RATE_TOKEN":
          error_message = t("error.EXPIRED_RATE_TOKEN");
          break;
        case "GENERIC":
        default:
          error_message = t("error.GENERIC");
          // this.resetCheckout("ALL");
          break;
      }

      GreennLogs.logger.info("🔴  Error Compra", {
        name: "Erro na Compra",
        product_id: product_id.value,
        error_code: error ? error.code : null,
        error_mensage: error_message,
      });
    },
  },
});
