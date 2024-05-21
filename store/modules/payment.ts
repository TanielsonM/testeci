// Utils
import { GreennLogs } from "@/utils/greenn-logs";

// Types
import {
  Payment,
  Product,
  PaymentError,
  SaleElement,
  CurrencyData,
  PurcharseCard,
  GlobalSettingsCard,
} from "~~/types";

// Rules
import { validateAll } from "@/rules/form-validations";

// FingerPrint
import { useVisitorData } from '@fingerprintjs/fingerprintjs-pro-vue-v3';

//Notifications
import * as Toast from "vue-toastification";

// Stores
import { usePersonalStore } from "../forms/personal";
import { useAddressStore } from "../forms/address";
import { usePurchaseStore } from "../forms/purchase";
import { useLeadsStore } from "../modules/leads";
import { useCheckoutStore } from "../checkout";
import { usePreCheckoutStore } from "../preCheckout";
import { useInstallmentsStore } from "./installments";
import { useAmountStore } from "./amount";
import { useCustomCheckoutStore } from "~~/store/customCheckout";
import { useHeadersStore } from "../headers";

// External SDK

export function leadsStore() {
  const store = useLeadsStore();
  return store;
}

export function checkoutStore() {
  const store = useCheckoutStore();
  return store;
}

export function productStore() {
  const store = useProductStore();
  return store;
}

export function personalStore() {
  const store = usePersonalStore();
  return store;
}

export function installmentsStore() {
  const store = useInstallmentsStore();
  return store;
}

export function addressStore() {
  const store = useAddressStore();
  return store;
}

export function purchaseStore() {
  const store = usePurchaseStore();
  return store;
}

export function preCheckout() {
  const store = usePreCheckoutStore();
  return store;
}

export function headerStore() {
  const store = useHeadersStore();
  return store;
}

export function amountStore() {
  const store = useAmountStore();
  return store;
}

const FINGERPRINT_BASE_URL = 'https://fpjscdn.net/v3/'

export const usePaymentStore = defineStore("Payment", {
  state: () => ({
    error: false,
    error_message: "",
    hasSent: false,
    // Payment button loading
    loading: false,
    fetching:false,
    fingerprintRequestId: ''
  }),
  getters: {
    isPaymentLoading: (state) => state.loading,
    isPaymentFetching: (state) => state.fetching,
  },
  actions: {
    setPaymentLoading(value = false) {
      this.loading = value;
    },
    setPaymentFetching(value = false) {
      this.fetching = value;
    },
    async payment(language: string, isUpdateSubscription = false) {
      const checkoutStore = useCheckoutStore();
      const productStore = useProductStore();
      const personalStore = usePersonalStore();
      const addressStore = useAddressStore();
      const purchaseStore = usePurchaseStore();
      const installmentsStore = useInstallmentsStore();
      const amountStore = useAmountStore();
      const preCheckout = usePreCheckoutStore();

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
        shipping_selected,
        products_client_statistics,
        history_subscription,
        urlClientId,
        urlClientDocument
      } = checkoutStore;

      const {
        productName,
        is_gift,
        gift_message,
        isDynamicShipping,
        hasTicketInstallments,
        hasAffiliationLead,
        product,
        product_global_settings,
        recipientIsActivated,
      } = productStore;

      const { name, email, document, cellphone } = personalStore;
      const { charge, shipping, sameAddress } = addressStore;
      const { first, second } = purchaseStore;
      const { getInstallments, getTotal } = installmentsStore;
      const { getOriginalAmount, getAmount } = amountStore;
      const { sellerHasFeatureTickets, getBatches } = preCheckout;

      if (!this.fetching) {
        this.setPaymentLoading(true);
        this.setPaymentFetching(true);
        const allValid = await validateAll();
        if (!allValid) {
          this.hasSent = true;
          this.setPaymentLoading(false);
          this.setPaymentFetching(false);
          return;
        }

        const leadsStore = useLeadsStore();
        leadsStore.changeStep(3);
        const total = computed(() => {
          if (method === "BOLETO" && hasTicketInstallments > 1) {
            return getTotal(ticket_installments);
          }
          if (["CREDIT_CARD", "TWO_CREDIT_CARDS"].includes(method)) {
            return getTotal();
          }
          return getInstallments(1);
        });

        let data: Payment = {
          // Purchase infos
          method: method,
          amount: getOriginalAmount,
          total: total.value,
          installments:
            method === "BOLETO" ? ticket_installments : installments,
          // product infos
          product_id: product_id.value,
          products: product_list.map((item: Product) => ({
            product_id:
              product.product_type_id === 3 && sellerHasFeatureTickets
                ? item.product_id
                : item.id,
            product_offer: item.hash,
            user_identification: item.user_identification,
          })),
          // proposal_id: proposal_id,
          // User details
          name: name,
          email: email.trim(),
          cellphone: cellphone.replace(/[^\d+]/g, ""),
          document: document,
          uuid: uuid,
          country_code: selectedCountry,
          // client_statistic: products_client_statistics.value,
          // Address
          zipcode: charge.zipcode ? charge.zipcode.replace(/[-]/g, "") : null,
          street: charge.street,
          number: charge.number,
          complement: charge.complement,
          neighborhood: charge.neighborhood,
          city: charge.city,
          state: charge.state,
          // Others
          language,
          upsell_id: hasUpsell,
          metas: url.query,
        };
        if (sellerHasFeatureTickets) {
          data.batches = getBatches
            .map((item: any) => ({
              batch_id: item.id,
              selected_tickets: item.selected_batch_tickets,
            }))
            .filter((batche) => batche.selected_tickets !== 0);
        }

        if (captchaEnabled) {
          data.captcha = captcha_code;
        }
        if (method === "PAYPAL") {
          data.paypal = paypal_details;
        }
        // Gift
        if (is_gift) {
          data.is_gift = is_gift;
          data.gift_message = gift_message;
        }
        // Physical product
        if (hasPhysicalProduct) {
          const address: any = sameAddress ? charge : shipping;
          data = {
            ...data,
            shipping_address_zip_code: address?.zipcode?.replace(/[-]/g, ""),
            shipping_address_street: address.street,
            shipping_address_number: address.number,
            shipping_address_complement: address.complement,
            shipping_address_neighborhood: address.neighborhood,
            shipping_address_city: address.city,
            shipping_address_state: address.state,
            shipping_selected: JSON.stringify({
              address,
              ...shipping_selected,
            }),
          };

          if (isDynamicShipping) {
            data.shipping_selected = JSON.stringify({
              address,
              ...shipping_selected,
            });
          }

          product_list.forEach((item: any) => {
            if (item?.shipping) {
              const index = data.products
                .map((prod) => prod.product_id)
                .indexOf(item.id);
              const shippingSelected: any = shipping_selected;

              data.products[index].shipping_amount = item.shipping.amount;
              data.products[index].shipping_service_id = item.shipping.id;
              data.products[index].shipping_service_name = item.shipping.name;
              data.products[index].shipping_selected = JSON.stringify({
                address,
                ...shipping_selected,
              });
            }
          });
        }
        // Affiliate id
        const affiliate_id = useCookie(`affiliate_${product_id}`);
        const affiliate = useCookie("affiliate");
        if (hasAffiliateId) {
          data.affiliate_id = hasAffiliateId.value;
        } else if (!hasAffiliationLead && affiliate_id.value) {
          data.affiliate_id = affiliate_id.value;
        } else if (hasAffiliationLead && affiliate.value) {
          data.affiliate_id = affiliate.value;
        }
        // Coupon
        if (coupon.applied && !!coupon.name) {
          data.products[0].coupon = coupon.name.toUpperCase();
        }
        /* When method is Credit card */
        if (
          ["CREDIT_CARD", "DEBIT_CARD", "TWO_CREDIT_CARDS"].includes(method)
        ) {
          const config = useRuntimeConfig();
          await this.setVisitorIdOnHeader()

          let parsedFirstAmount = Number(
            first.amount
              .toString()
              .replace("R$", "")
              .replace(".", "")
              .replace(",", ".")
          );
          let firstCardAmountWithoutInterest = parsedFirstAmount;
          if (method === "TWO_CREDIT_CARDS") {
            let percentageFirstCard = parsedFirstAmount / total.value;
            firstCardAmountWithoutInterest = getAmount * percentageFirstCard;
          }
          let cards: any = [];

          let card = {
            total: Number(parsedFirstAmount).toFixed(2),
            amount: Number(firstCardAmountWithoutInterest).toFixed(2),
            card_cvv: first.cvv,
            card_expiration_date: `${first.month}${first.year}`,
            card_holder_name: first.holder_name,
            card_number: first.number,
          };

          if (history_subscription?.contract_amount) {
            card.total = Number(history_subscription?.contract_amount).toFixed(2);
            card.amount = Number(history_subscription?.contract_amount).toFixed(2);
          }

          cards.push(card);

          if (method === "TWO_CREDIT_CARDS") {
            let parsedSecondAmount = Number(
              second.amount
                .toString()
                .replace("R$", "")
                .replace(".", "")
                .replace(",", ".")
            );
            cards.push({
              total: Number(parsedSecondAmount).toFixed(2),
              amount: Number(
                getAmount - firstCardAmountWithoutInterest
              ).toFixed(2),
              card_cvv: second.cvv,
              card_expiration_date: `${second.month}${second.year}`,
              card_holder_name: second.holder_name,
              card_number: second.number,
            });
          }
          data.cards = cards;
          
        }
        const allowed_installments = [
          "CREDIT_CARD",
          "TWO_CREDIT_CARDS",
          "DEBIT_CARD",
          "BOLETO",
        ];
        if (!allowed_installments.includes(method)) {
          delete data.installments;
        }
        const currency_data: CurrencyData = {
          local_currency: "BRL",
          base_currency: "BRL",
        };
        data.currency_data = currency_data;
        // Registrando log boleto
        let dataLog = Object.assign({}, data);
        GreennLogs.logger.info("🟡 Dados da Compra", {
          name: `Enviando objeto da compra [${method}]`,
          objetoCompra: JSON.stringify(dataLog),
        });
        checkoutStore.setLoading(true);

        try {
          let promises = [];

          let errorRequestCard = false;

          if (data.cards) {
            let gateway = this.getGateway(
              product.type,
              method,
              product_global_settings,
              data.installments ? Number(data.installments) : null,
              recipientIsActivated
            );

            if (gateway) {
              data.gateway = gateway;
            }
            for (let i = 0; i < data.cards.length; i++) {
              const card = data.cards[i];
              if (
                "card_holder_name" in card &&
                "card_number" in card &&
                "card_expiration_date" in card
              ) {
                let amount = data.cards[i].amount; // Armazenar o valor do campo amount
                let total = data.cards[i].total; // Armazenar o valor do campo total

                let dataGateway = {
                  system: "CHECKOUT",
                  gateway: gateway,
                  card: {
                    holder_name: card.card_holder_name,
                    number: card.card_number.replace(/\s/g, ""),
                    exp_month: card.card_expiration_date
                      ? card.card_expiration_date.substring(0, 2)
                      : null,
                    exp_year: card.card_expiration_date
                      ? card.card_expiration_date.substring(4)
                      : null,
                    cvv: card.card_cvv,
                    costumer: this.customerData(data),
                  },
                };

                // Criar a promessa e armazená-la no array de promessas
                let promise = await this.cardGateway(dataGateway)
                  .then((responseGateway) => {
                    // Atualizar o objeto data.cards[i] mantendo os campos amount e total
                    if (data.cards) {
                      data.cards[i] = {
                        id: responseGateway.id,
                        last_digits: responseGateway.data
                          ? responseGateway.data.last_digits
                          : responseGateway.last_digits,
                        first_digits: responseGateway.data
                          ? responseGateway.data.first_digits
                          : responseGateway.first_digits,
                        customer: responseGateway.customer || null,
                        amount,
                        total,
                      };
                    }
                  })
                  .catch((error) => {
                    // Tratar erros
                    errorRequestCard = true;
                    console.error(error);
                    let dataError = Object.assign(
                      {},
                      error?.value?.response?._data
                    );
                    dataError.code = dataError.object;
                    this.validateError(dataError);
                  });
                promises.push(promise);
              }
            }
          }

          // Aguardar a resolução de todas as promessas usando Promise.all()
          await Promise.all(promises);
          if(!isUpdateSubscription && !errorRequestCard) {
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
                    product_id: product_id,
                  });
                  let query: any = {};
                  const principal_product = res.sales
                    .filter(
                      (item: SaleElement) => item.product.name === productName
                    )
                    .pop();
                  // Set principal product query
                  if (principal_product?.chc || res?.sales[0]?.chc)
                    query.chc = principal_product?.chc || res?.sales[0]?.chc;
                  if (principal_product?.token || res?.sales[0]?.token)
                    query.token =
                      principal_product?.token || res?.sales[0]?.token;
                  if (principal_product?.sale_id || res?.sales[0]?.sale_id) {
                    delete query.chc;
                    query.s_id = res.sales[0].sale_id;
                  }
                  if (!!product_offer) query.offer = product_offer;

                  // Set query bumps
                  const route = useRoute();

                  // Se o produto for do tipo evento
                  if (
                    product?.product_type_id === 3 &&
                    sellerHasFeatureTickets
                  ) {
                    product_list.forEach(
                      (
                        ticket: { id: number; name: string; hash: string },
                        i
                      ) => {
                        const sale = res.sales.find(
                          (item: any) => item.product.offer_hash === ticket.hash
                        );
                        if (sale)
                          query["ticket_id_" + i] =
                            ticket.id + "-s_id_" + sale.sale_id;
                      }
                    );
                  } else {
                    const keys = Object.keys(route.query);
                    const bumps = product_list.filter(
                      (item: Product) => item.id !== parseInt(product_id)
                    );

                    bumps.forEach((bump: Product) => {
                      const index = keys
                        .filter(
                          (key) => route.query[key] === bump.id.toString()
                        )
                        .pop();
                      const sale = res.sales
                        .filter((item: any) => item.product.name === bump.name)
                        .pop();
                      if (!!sale && !!index) {
                        if (bump.type === "SUBSCRIPTION") {
                          if (sale.sale_id) {
                            query[index] =
                              route.query[index] +
                              "-chc_" +
                              sale.chc +
                              "-s_id_" +
                              sale.sale_id;
                          } else {
                            query[index] =
                              route.query[index] + "-chc_" + sale.chc;
                          }
                        } else {
                          query[index] =
                            route.query[index] + "-s_id_" + sale.sale_id;
                        }
                      }
                    });
                  }

                  const router = useRouter();
                  router.push({
                    path: `/${product_id}/obrigado`,
                    query,
                  });
                  return;
                }
                if (
                  Array.isArray(res?.sales) &&
                  res.sales.some((item: SaleElement) => !item.success)
                ) {
                  this.validateError(res?.sales[0]);
                  return;
                }
                if (res.status === "error" && !res.sales?.success) {
                  this.validateError(res);
                  return;
                }
              })
              .catch((err) => {
                console.error(err);
                checkoutStore.setLoading(false);
                this.setPaymentLoading(false);
              })
              .finally(() => {
                this.setPaymentFetching(false);
                this.setPaymentLoading(false);
              });

          } else if(!errorRequestCard) {
            // Payment request
            const body = {
              client_id: urlClientId,
              product_type: "COMMON",
              amount: data.amount,
              cpf_cnpj: urlClientDocument,
              cards: data.cards,
              id: product_id,
              gateway: data.gateway
            }

            await useApi()
              .update(`/payment/${product_id}`, body)
              .then((res) => {
                if (
                  res.sales !== undefined &&
                  Array.isArray(res.sales) &&
                  res.sales.every((item: SaleElement) => item.success)
                ) {
                  GreennLogs.logger.info("🟢 Success Compra", {
                    name: "Compra concluída com sucesso",
                    product_id: product_id,
                  });
                  let query: any = {};
                  const principal_product = res.sales
                    .filter(
                      (item: SaleElement) => item.product.name === productName
                    )
                    .pop();
                  // Set principal product query
                  if (principal_product?.chc || res?.sales[0]?.chc)
                    query.chc = principal_product?.chc || res?.sales[0]?.chc;
                  if (principal_product?.token || res?.sales[0]?.token)
                    query.token =
                      principal_product?.token || res?.sales[0]?.token;
                  if (principal_product?.sale_id || res?.sales[0]?.sale_id) {
                    delete query.chc;
                    query.s_id = res.sales[0].sale_id;
                  }
                  if (!!product_offer) query.offer = product_offer;

                  // Set query bumps
                  const route = useRoute();

                  // Se o produto for do tipo evento
                  if (
                    product?.product_type_id === 3 &&
                    sellerHasFeatureTickets
                  ) {
                    product_list.forEach(
                      (
                        ticket: { id: number; name: string; hash: string },
                        i
                      ) => {
                        const sale = res.sales.find(
                          (item: any) => item.product.offer_hash === ticket.hash
                        );
                        if (sale)
                          query["ticket_id_" + i] =
                            ticket.id + "-s_id_" + sale.sale_id;
                      }
                    );
                  } else {
                    const keys = Object.keys(route.query);
                    const bumps = product_list.filter(
                      (item: Product) => item.id !== parseInt(product_id)
                    );

                    bumps.forEach((bump: Product) => {
                      const index = keys
                        .filter(
                          (key) => route.query[key] === bump.id.toString()
                        )
                        .pop();
                      const sale = res.sales
                        .filter((item: any) => item.product.name === bump.name)
                        .pop();
                      if (!!sale && !!index) {
                        if (bump.type === "SUBSCRIPTION") {
                          if (sale.sale_id) {
                            query[index] =
                              route.query[index] +
                              "-chc_" +
                              sale.chc +
                              "-s_id_" +
                              sale.sale_id;
                          } else {
                            query[index] =
                              route.query[index] + "-chc_" + sale.chc;
                          }
                        } else {
                          query[index] =
                            route.query[index] + "-s_id_" + sale.sale_id;
                        }
                      }
                    });
                  }

                  const router = useRouter();
                  router.push({
                    path: `/${product_id}/obrigado`,
                    query,
                  });
                  return;
                }
                if (
                  Array.isArray(res?.sales) &&
                  res.sales.some((item: SaleElement) => !item.success)
                ) {
                  this.validateError(res?.sales[0]);
                  return;
                }
                if (res.status === "error" && !res.sales?.success) {
                  this.validateError(res);
                  return;
                }
              })
              .catch((err) => {
                console.error(err);
                checkoutStore.setLoading(false);
                this.setPaymentLoading(false);
              })
              .finally(() => {
                this.setPaymentFetching(false);
                this.setPaymentLoading(false);
              });
          }
        } catch (error) {
          // Se ocorrer um erro em qualquer uma das promessas, ele será capturado aqui
          console.error("Erro:", error);
        }
      } else {
        this.setPaymentFetching(false);
        this.setPaymentLoading(false);
      }
    },
    validateError(error: PaymentError) {
      const checkoutStore = useCheckoutStore();

      const { product_id } = checkoutStore;

      checkoutStore.setLoading(false);
      this.loading = false;
      switch (error.code) {
        case "TICKET_UNAVAILABLE":
          this.error_message = "error.TICKET_UNAVAILABLE";
          break;
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
        case "CREDIT_CARD_INVALID":
          this.error_message = "error.CREDIT_CARD_INVALID";
          break;
        case "GENERIC":
        default:
          this.error_message = "error.GENERIC";
          // this.resetCheckout("ALL");
          break;
      }

      GreennLogs.logger.info("🔴 Error Compra", {
        name: "Erro na Compra",
        product_id: product_id,
        error_code: error ? error.code : null,
        error_mensage: this.error_message,
      });
    },
    isPurcharseCard(card: any): card is PurcharseCard {
      return (
        typeof card.amount !== "undefined" &&
        typeof card.card_cvv === "string" &&
        typeof card.card_expiration_date === "string" &&
        typeof card.card_holder_name === "string" &&
        typeof card.card_number === "string"
      );
    },
    getGateway(
      type: string,
      metodo: string,
      global_settings: GlobalSettingsCard[],
      installments: number | null,
      recipientIsActivated: boolean
    ): any {
      const toast = Toast.useToast();

      //concatena type com method tranformando em letras Maiúsculas
      let gatewayKey = `${type.toUpperCase()}_${metodo.toUpperCase()}`;
      let result = "";

      switch (gatewayKey) {
        case "TRANSACTION_CREDIT_CARD":
        case "SUBSCRIPTION_CREDIT_CARD":
        case "TRANSACTION_TWO_CREDIT_CARDS":
        case "SUBSCRIPTION_TWO_CREDIT_CARDS":
        case "TRANSACTION_BOLETO":
        case "SUBSCRIPTION_BOLETO":
          result = "PAGARME";
        case "TRANSACTION_PIX":
        case "SUBSCRIPTION_PIX":
          result = "IUGU";
        case "SUBSCRIPTION_CREDIT_CARD_DLOCAL":
        case "TRANSACTION_CREDIT_CARD_DLOCAL":
          result = "DLOCAL";
        default:
          result = "";
      }

      if (global_settings && global_settings.length > 0) {
        // Faz um find dentro das configurações globais
        const databaseConfiguration = global_settings.find(
          (config) => config.key === gatewayKey
        );

        // Se encontrar, retorna o valor correspondente
        if (databaseConfiguration) {
          result = databaseConfiguration.value;
        }

        const gatewayLowInstallment = global_settings.find(
          (config) => config.key === "TRANSACTION_CREDIT_CARD_LOW_INSTALLMENT"
        );

        let valuegatewayLowInstallment = null;

        if (gatewayLowInstallment) {
          valuegatewayLowInstallment = gatewayLowInstallment.value;

          if (installments && installments <= 2) {
            // Se encontrar, retorna o valor correspondente
            if (gatewayLowInstallment) {
              result = gatewayLowInstallment.value;
            }
          }

          if (
            result == "PAGARME" &&
            !recipientIsActivated &&
            valuegatewayLowInstallment == "IUGU"
          ) {
            result = "IUGU";
          }
        }
      }

      return result;
    },
    async cardGateway(dataGateway: any) {
      const toast = Toast.useToast();
     
      try {
        //Tem que passar true para dizer que é uma rota que usa o endpoint do gateway
        const response = await useApi().create(
          "/checkout/card",
          dataGateway,
          null,
          true
        );
        return response;
      } catch (error) {
        // Tratar erros
        throw error; // Lançar o erro novamente para que ele possa ser tratado onde a função cardGateway() foi chamada
      }
    },
    async setVisitorIdOnHeader(){
      const headerStore = useHeadersStore();

      const config = useRuntimeConfig();
      let composeUrl = FINGERPRINT_BASE_URL+config.public.FINGERPRINT_API_KEY
      
      try {
        const fpPromise = import(composeUrl).then(
          (FingerprintJS) =>
            FingerprintJS.load()
        );
  
        const { requestId } = await (await fpPromise).get();
        headerStore.changeFingerprintHeader(requestId)

      } catch (error) {
        GreennLogs.logger.error("ErrorFingerPrint", {
          name: "ErrorFingerPrint",
          error_code: error ? error.code : null,
          error_mensage: this.error_message,
        });
      }
    },
    documentType(data: any):string {
       //Essa parte modifiquei pois o New Checkout não tem venda internacional
      return data.document.length > 14 ? 'cnpj' : 'cpf';
    },
    customerData(data: any): any {
      let document_number = data.document.replace(/\D/g, "");
      let document_type = this.documentType(data);
      let zipcodeFormatted = data.zipcode
        ? data.zipcode.slice(0, 5) + "-" + data.zipcode.slice(5)
        : null;

      let document = {};
      if (document_number) {
        document = {
          document: {
            type: document_type,
            number: document_number,
            document_type: document_type,
            document_number: document_number,
          },
        };
      }

      let address = {};
      if (data.city) {
        address = {
          address: {
            street: data.street,
            street_number: data.number,
            state: data.state || data.uf,
            city: data.city,
            neighborhood: data.neighborhood,
            zipcode: zipcodeFormatted,
          },
        };
      }

      data.client_id = null; // Passando como nulo, pq até então o client não foi criado
      return {
        external_id: String(data.client_id),
        name: data.name,
        phone: data.cellphone,
        email: data.email,
        document_number: document_number,
        document_type: document_type,
        ...document,
        ...address,
      };
    },
  },
});
