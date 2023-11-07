// Utils
import { GreennLogs } from "@/utils/greenn-logs";

// Types
import { Payment, Product, PaymentError, SaleElement } from "~~/types";

// Rules
import { validateAll } from "@/rules/form-validations";

// Stores
import { usePersonalStore } from "../forms/personal";
import { useAddressStore } from "../forms/address";
import { usePurchaseStore } from "../forms/purchase";
import { useLeadsStore } from "../modules/leads";
import { useCheckoutStore } from "../checkout";
import { useInstallmentsStore } from "./installments";
import { useAmountStore } from "./amount";

// External SDK
import { loadMercadoPago } from "@mercadopago/sdk-js";

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
  captchaEnabled,
  captcha_code,
  selectedCountry,
  hasPhysicalProduct,
  product_list,
  hasAffiliateId,
  installments,
  coupon,
  hasUpsell,
  ticket_installments,
  url,
  paypal_details,
  shipping_selected
} = storeToRefs(checkoutStore);
const {
  productName,
  is_gift,
  gift_message,
  product,
  hasTicketInstallments,
  hasAffiliationLead,
} = storeToRefs(productStore);

const { name, email, document, cellphone } = storeToRefs(personalStore);
const { charge, shipping, sameAddress } = storeToRefs(addressStore);
const { first, second } = storeToRefs(purchaseStore);
const { getInstallments } = storeToRefs(installmentsStore);
const { getOriginalAmount, getAmount } = storeToRefs(amountStore);

export const usePaymentStore = defineStore("Payment", {
  state: () => ({
    error: false,
    error_message: "",
    hasSent: false,
  }),
  getters: {},
  actions: {
    async payment(language: string) {
      const allValid = await validateAll();
      if (!allValid) {
        this.hasSent = true;
        return;
      }

      leadsStore.changeStep(3);

      const total = computed(() => {
        if (method.value === "BOLETO" && hasTicketInstallments.value > 1) {
          return (
            getInstallments.value(ticket_installments.value) *
            ticket_installments.value
          );
        }
        if (["CREDIT_CARD", "TWO_CREDIT_CARDS"].includes(method.value)) {
          return parseFloat((getInstallments.value() * installments.value).toFixed(2));
        }
        return getInstallments.value(1);
      });

      let data: Payment = {
        // Purchase infos
        method: method.value,
        amount: getOriginalAmount.value,
        total: total.value,
        installments:
          method.value === "BOLETO"
            ? ticket_installments.value
            : installments.value,
        // product infos
        product_id: product_id.value,
        products: product_list.value.map((item: Product) => ({
          product_id: item.id,
          product_offer: item.hash,
        })),
        // proposal_id: proposal_id,
        // User details
        name: name.value,
        email: email.value.trim(),
        cellphone: cellphone.value.replace(/[^\d+]/g, ""),
        document: document.value,
        uuid: uuid.value,
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
        state: charge.value.state,
        // Others
        language,
        upsell_id: hasUpsell.value,
        metas: url.value.query,
      };

      if (captchaEnabled.value) {
        data.captcha = captcha_code.value;
      }

      if (method.value === "PAYPAL") {
        data.paypal = paypal_details.value;
      }

      // Gift
      if (is_gift.value) {
        data.is_gift = is_gift.value;
        data.gift_message = gift_message.value;
      }

      // Physical product
      if (hasPhysicalProduct.value) {
        const address: any = sameAddress.value ? charge.value : shipping.value;
        data = {
          ...data,
          shipping_address_zip_code: address?.zipcode?.replace(/[-]/g, ''),
          shipping_address_street: address.street,
          shipping_address_number: address.number,
          shipping_address_complement: address.complement,
          shipping_address_neighborhood: address.neighborhood,
          shipping_address_city: address.city,
          shipping_address_state: address.state,
          shipping_selected: JSON.stringify({address, ...shipping_selected.value})
        };

        product_list.value.forEach((item: any) => {
          if (item?.shipping) {
            const index = data.products
              .map((prod) => prod.product_id)
              .indexOf(item.id);

            data.products[index].shipping_amount = item.shipping.amount;
            data.products[index].shipping_service_id = item.shipping.id;
            data.products[index].shipping_service_name = item.shipping.name;
            data.products[index].shipping_selected = JSON.stringify({address, ...shipping_selected.value});
          }
        });
      }
      // Affiliate id
      const affiliate_id = useCookie(`affiliate_${product_id.value}`);
      const affiliate = useCookie("affiliate");
      if (hasAffiliateId.value) {
        data.affiliate_id = hasAffiliateId.value;
      } else if (!hasAffiliationLead.value && affiliate_id.value) {
        data.affiliate_id = affiliate_id.value;
      } else if (hasAffiliationLead.value && affiliate.value) {
        data.affiliate_id = affiliate.value;
      }

      // Coupon
      if (coupon.value.applied && !!coupon.value.name) {
        data.products[0].coupon = coupon.value.name.toUpperCase();
      }

      /* When method is Credit card */
      if (
        ["CREDIT_CARD", "DEBIT_CARD", "TWO_CREDIT_CARDS"].includes(method.value)
      ) {
        await loadMercadoPago();
        const mp = new window.MercadoPago("APP_USR-7b72e384-6c0c-4354-a95a-4a7458cdce68", {
          locale: "pt-BR",
        });
        
        let parsedFirstAmount = Number(
          first.value.amount
            .toString()
            .replace("R$", "")
            .replace(".", "")
            .replace(",", ".")
        );
        let firstCardAmountWithoutInterest = parsedFirstAmount;
        if (method.value === "TWO_CREDIT_CARDS") {
          let percentageFirstCard = parsedFirstAmount / total.value;
          firstCardAmountWithoutInterest =
            getAmount.value * percentageFirstCard;
        }
        let cards: any = [];
        cards.push({
          total: Number(parsedFirstAmount).toFixed(2),
          amount: Number(firstCardAmountWithoutInterest).toFixed(2),
          card_cvv: first.value.cvv,
          card_expiration_date: `${first.value.month}${first.value.year}`,
          card_holder_name: first.value.holder_name,
          card_number: first.value.number,
        });

        // Mercado Pago token - First Card
        if (installments.value >= 10) {  
          const firstCardToken = mp.createCardToken({
            cardNumber: first.value.number.replaceAll(" ", ""),
            cardholderName: first.value.holder_name,
            cardExpirationMonth: first.value.month,
            cardExpirationYear: first.value.year,
            securityCode: first.value.cvv,
            identificationType: document.value.replace(/[^\d]/g, "").length === 11 ? "CPF" : "CNPJ",
            identificationNumber: document.value.replace(/[^\d]/g, ""),
          });          

          Promise.resolve(firstCardToken).then(function(res) {
            cards[0].card_hash = res.id;
            data.gateway = "MERCADOPAGO";
          });
        }

        if (method.value === "TWO_CREDIT_CARDS") {
          let parsedSecondAmount = Number(
            second.value.amount
              .toString()
              .replace("R$", "")
              .replace(".", "")
              .replace(",", ".")
          );
          cards.push({
            total: Number(parsedSecondAmount).toFixed(2),
            amount: Number(
              getAmount.value - firstCardAmountWithoutInterest
            ).toFixed(2),
            card_cvv: second.value.cvv,
            card_expiration_date: `${second.value.month}${second.value.year}`,
            card_holder_name: second.value.holder_name,
            card_number: second.value.number,
          });
          
          // Mercado Pago token - Second Card
          if (installments.value >= 10) {  
            const secondCardToken = mp.createCardToken({
              cardNumber: second.value.number.replaceAll(" ", ""),
              cardholderName: second.value.holder_name,
              cardExpirationMonth: second.value.month,
              cardExpirationYear: second.value.year,
              securityCode: second.value.cvv,
              identificationType: document.value.replace(/[^\d]/g, "").length === 11 ? "CPF" : "CNPJ",
              identificationNumber: document.value.replace(/[^\d]/g, ""),
            });
  
            Promise.resolve(secondCardToken).then(function(res) {
              cards[1].card_hash = res.id;
            });
          }
        }
        data.cards = cards;
      }
      console.log(data);
      
      const allowed_installments = [
        "CREDIT_CARD",
        "TWO_CREDIT_CARDS",
        "DEBIT_CARD",
        "BOLETO",
      ];
      if (!allowed_installments.includes(method.value)) {
        delete data.installments;
      }

      // Registrando log boleto
      let dataLog = Object.assign({}, data);

      GreennLogs.logger.info("🟡 Dados da Compra", {
        name: `Enviando objeto da compra [${method.value}]`,
        objetoCompra: JSON.stringify(dataLog),
      });

      // checkoutStore.setLoading(true);
      // // Payment request
      // await useApi()
      //   .create("/payment", data)
      //   .then((res) => {
      //     if (
      //       res.sales !== undefined &&
      //       Array.isArray(res.sales) &&
      //       res.sales.every((item: SaleElement) => item.success)
      //     ) {
      //       GreennLogs.logger.info("🟢 Success Compra", {
      //         name: "Compra concluída com sucesso",
      //         product_id: product_id.value,
      //       });
      //       const query: any = {};
      //       const principal_product = res.sales
      //         .filter(
      //           (item: SaleElement) => item.product.name === productName.value
      //         )
      //         .pop();
      //       // Set principal product query
      //       if (principal_product?.chc) query.chc = principal_product.chc;
      //       if (principal_product?.token) query.token = principal_product.token;
      //       if (principal_product?.sale_id) {
      //         delete query.chc;
      //         query.s_id = res.sales[0].sale_id;
      //       }
      //       if (!!product_offer.value) query.offer = product_offer.value;

      //       // Set query bumps
      //       const route = useRoute();
      //       const keys = Object.keys(route.query);
      //       const bumps = product_list.value.filter(
      //         (item: Product) => item.id !== parseInt(product_id.value)
      //       );

      //       bumps.forEach((bump: Product) => {
      //         const index = keys
      //           .filter((key) => route.query[key] === bump.id.toString())
      //           .pop();
      //         const sale = res.sales
      //           .filter((item: any) => item.product.name === bump.name)
      //           .pop();
      //         if (!!sale && !!index) {
      //           if (bump.type === "SUBSCRIPTION") {
      //             if (sale.sale_id) {
      //               query[index] =
      //                 route.query[index] +
      //                 "-chc_" +
      //                 sale.chc +
      //                 "-s_id_" +
      //                 sale.sale_id;
      //             } else {
      //               query[index] = route.query[index] + "-chc_" + sale.chc;
      //             }
      //           } else {
      //             query[index] = route.query[index] + "-s_id_" + sale.sale_id;
      //           }
      //         }
      //       });
      //       const router = useRouter();
      //       router.push({
      //         path: `/${product_id.value}/obrigado`,
      //         query,
      //       });

      //       return;
      //     }
      //     if (
      //       Array.isArray(res?.sales) &&
      //       res.sales.some((item: SaleElement) => !item.success)
      //     ) {
      //       this.validateError(res?.sales[0]);
      //       return;
      //     }
      //     if (res.status === "error" && !res.sales?.success) {
      //       this.validateError(res);
      //       return;
      //     }
      //   })
      //   .catch(() => {
      //     checkoutStore.setLoading(false);
      //   });
    },
    validateError(error: PaymentError) {
      checkoutStore.setLoading(false);
      switch (error.code) {
        case "0001":
          this.error_message = "error.0001";
          // this.resetCheckout("CARD");
          break;
        case "BANK":
          this.error_message = "error.BANK";
          // this.resetCheckout("ALL");
          break;
        case "BLACKLIST_PURCHASE":
          this.error_message = "error.BLACKLIST_PURCHASE";
          // this.resetCheckout("ALL");
          break;
        case "INVALID_CVV":
          this.error_message = "error.INVALID_CVV";
          // this.resetCheckout("CVV");
          break;
        case "INVALID_CLIENT_DATA":
          this.error_message = "error.INVALID_CLIENT_DATA";
          // this.resetCheckout("ALL");
          break;
        case "DUPLICATE_PURCHASE":
          this.error_message = "error.DUPLICATE_PURCHASE";
          // this.resetCheckout("ALL");
          break;
        case "PRODUCT_OUT_OF_STOCK":
          this.error_message = "error.PRODUCT_OUT_OF_STOCK";
          // this.resetCheckout("ALL");
          break;
        case "CREDIT_CARD_OPERATOR":
          this.error_message = "error.CREDIT_CARD_OPERATOR";
          // this.resetCheckout("ALL");
          break;
        case "INVALID_DATA":
          this.error_message = "error.INVALID_DATA";
          // this.resetCheckout("CARD");
          break;
        case "INVALID_CREDIT_CARD":
          this.error_message = "error.INVALID_CREDIT_CARD";
          // this.resetCheckout("ALL");
          break;
        case "INSUFFICIENT_FUNDS":
          this.error_message = "error.INSUFFICIENT_FUNDS";
          // this.resetCheckout("CARD");
          break;
        case "INVALID_PAYMENT_TYPE":
          this.error_message = "error.INVALID_PAYMENT_TYPE";
          // this.resetCheckout("ALL");
          break;
        case "INVALID_INSTALLMENTS":
          this.error_message = "error.INVALID_INSTALLMENTS";
          // this.resetCheckout("CARD");
          break;
        case "INVALID_INSTALLMENTS_BUMP":
          this.error_message = "error.INVALID_INSTALLMENTS_BUMP";
          // this.resetCheckout("CARD");
          break;
        case "CURRENCY_NOT_SUPPORTED":
          this.error_message = "error.CURRENCY_NOT_SUPPORTED";
          // this.resetCheckout("CARD");
          break;
        case "SUSPECTED_FRAUD":
          this.error_message = "error.SUSPECTED_FRAUD";
          // this.resetCheckout("ALL");
          break;
        case "EXPIRED_RATE_TOKEN":
          this.error_message = "error.EXPIRED_RATE_TOKEN";
          break;
        case "GENERIC":
        default:
          this.error_message = "error.GENERIC";
          // this.resetCheckout("ALL");
          break;
      }

      GreennLogs.logger.info("🔴 Error Compra", {
        name: "Erro na Compra",
        product_id: product_id.value,
        error_code: error ? error.code : null,
        error_mensage: this.error_message,
      });
    },
  },
});
