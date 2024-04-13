// Utils
import { GreennLogs } from "@/utils/greenn-logs";

// Types
import { Payment, Product, PaymentError, SaleElement, CurrencyData, PurcharseCard, GlobalSettingsCard} from "~~/types";

// Rules
import { validateAll } from "@/rules/form-validations";

//Notifications
import * as Toast from "vue-toastification";

// Stores
import { usePersonalStore } from "../forms/personal";
import { useAddressStore } from "../forms/address";
import { usePurchaseStore } from "../forms/purchase";
import { useLeadsStore } from "../modules/leads";
import { useCheckoutStore } from "../checkout";
import { useInstallmentsStore } from "./installments";
import { useAmountStore } from "./amount";
import { useCustomCheckoutStore } from "~~/store/customCheckout";

// External SDK

const leadsStore = useLeadsStore();
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
  shipping_selected
} = storeToRefs(checkoutStore);
const {
  productName,
  is_gift,
  gift_message,
  isDynamicShipping,
  hasTicketInstallments,
  hasAffiliationLead,
  product,
  product_global_settings,
  recipientIsActivated
} = storeToRefs(productStore);

const { name, email, document, cellphone } = storeToRefs(personalStore);
const { charge, shipping, sameAddress } = storeToRefs(addressStore);
const { first, second } = storeToRefs(purchaseStore);
const { getInstallments, getTotal } = storeToRefs(installmentsStore);
const { getOriginalAmount, getAmount } = storeToRefs(amountStore);
const { sellerHasFeatureTickets } = storeToRefs(preCheckout);

export const usePaymentStore = defineStore("Payment", {
  state: () => ({
    error: false,
    error_message: "",
    hasSent: false,
    // Payment button loading
    loading: false,
    fetching:false,
  }),
  getters: {
    isPaymentLoading: state => state.loading,
    isPaymentFetching: state => state.fetching,
  },
  actions: {
    setPaymentLoading(value = false) {
      this.loading = value;
    },
    setPaymentFetching(value = false) {
      this.fetching = value;
    },
    async payment(language: string) {
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

        leadsStore.changeStep(3);
        const total = computed(() => {
          if (method.value === "BOLETO" && hasTicketInstallments.value > 1) {
            return (getTotal.value(ticket_installments.value));
          }
          if (["CREDIT_CARD", "TWO_CREDIT_CARDS"].includes(method.value)) {
            return getTotal.value();
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
            product_id: product.value.product_type_id === 3 && sellerHasFeatureTickets?.value ? item.product_id : item.id,
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
            shipping_selected: JSON.stringify({ address, ...shipping_selected.value })
          };

          if(isDynamicShipping.value) {
            data.shipping_selected = JSON.stringify({address, ...shipping_selected.value});
          }

          product_list.value.forEach((item: any) => {
            if (item?.shipping) {
              const index = data.products.map((prod) => prod.product_id).indexOf(item.id);
              const shippingSelected: any = shipping_selected;

              data.products[index].shipping_amount = item.shipping.amount;
              data.products[index].shipping_service_id = item.shipping.id;
              data.products[index].shipping_service_name = item.shipping.name;
              data.products[index].shipping_selected = JSON.stringify({ address, ...shipping_selected.value });
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
          const config = useRuntimeConfig();

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

            
          }
          data.cards = cards;
        }
        const allowed_installments = [
          "CREDIT_CARD",
          "TWO_CREDIT_CARDS",
          "DEBIT_CARD",
          "BOLETO",
        ];
        if (!allowed_installments.includes(method.value)) {
          delete data.installments;
        }
        const currency_data: CurrencyData = {
          local_currency: 'BRL',
          base_currency: 'BRL'
        };
        data.currency_data = currency_data;
        // Registrando log boleto
        let dataLog = Object.assign({}, data);
        GreennLogs.logger.info("🟡 Dados da Compra", {
          name: `Enviando objeto da compra [${method.value}]`,
          objetoCompra: JSON.stringify(dataLog),
        });
        checkoutStore.setLoading(true);
        
        try { 
          let gateway = this.getGateway(
                product.value.type, 
                method.value, 
                product_global_settings.value, 
                data.installments ? Number(data.installments) : null, 
                recipientIsActivated.value);

          if(gateway){
            data.gateway = gateway;
          }
          
          let promises = [];

          let errorRequestCard = false;

          if(data.cards ){
            for (let i = 0; i < data.cards.length; i++) {
              const card = data.cards[i];
              if ('card_holder_name' in card && 'card_number' in card && 'card_expiration_date' in card) {
                let amount = data.cards[i].amount; // Armazenar o valor do campo amount
                let total = data.cards[i].total; // Armazenar o valor do campo total
      
                let dataGateway = {
                  system: 'CHECKOUT',
                  gateway: gateway,
                  card: {
                    holder_name: card.card_holder_name,
                    number: card.card_number.replace(/\s/g, ''),
                    exp_month: card.card_expiration_date ? card.card_expiration_date.substring(0, 2) : null,
                    exp_year: card.card_expiration_date ? card.card_expiration_date.substring(2) : null,
                    cvv: card.card_cvv,
                    costumer: this.customerData(data)
                  }
                }
                
                // Criar a promessa e armazená-la no array de promessas
                let promise = this.cardGateway(dataGateway).then(responseGateway => {
                  // Atualizar o objeto data.cards[i] mantendo os campos amount e total
                  if(data.cards){
                    data.cards[i] = {id: responseGateway.id, customer: responseGateway.customer || null, amount, total}; 
                  }
                })
                .catch(error => {
                  // Tratar erros
                  errorRequestCard = true;
                  console.error(error);
                });        
                promises.push(promise);
              }
            }
          }
  
          // Aguardar a resolução de todas as promessas usando Promise.all()
          await Promise.all(promises);
            if(!errorRequestCard){
              // Payment request
              await useApi()
                .create("/payment", data)
                .then(res => {
                  if (
                    res.sales !== undefined &&
                    Array.isArray(res.sales) &&
                    res.sales.every((item: SaleElement) => item.success)
                  ) {
                    GreennLogs.logger.info("🟢 Success Compra", {
                      name: "Compra concluída com sucesso",
                      product_id: product_id.value,
                    });
                    let query: any = {};
                    const principal_product = res.sales
                      .filter(
                        (item: SaleElement) => item.product.name === productName.value
                      )
                      .pop();
                    // Set principal product query
                    if (principal_product?.chc || res?.sales[0]?.chc) query.chc = principal_product?.chc || res?.sales[0]?.chc;
                    if (principal_product?.token || res?.sales[0]?.token) query.token = principal_product?.token || res?.sales[0]?.token;
                    if (principal_product?.sale_id || res?.sales[0]?.sale_id) {
                      delete query.chc;
                      query.s_id = res.sales[0].sale_id;
                    }
                    if (!!product_offer.value) query.offer = product_offer.value;

                    // Set query bumps
                    const route = useRoute();

                    // Se o produto for do tipo evento
                    if(product?.value?.product_type_id === 3 && sellerHasFeatureTickets?.value) {
                      product_list.value.forEach((ticket: {id: number, name: string, hash: string}, i) => {
                        const sale = res.sales.find((item: any) => item.product.offer_hash === ticket.hash);
                        if(sale) query['ticket_id_'+i] = (ticket.id + "-s_id_" + sale.sale_id)
                      })
                    } else {
                      const keys = Object.keys(route.query);
                      const bumps = product_list.value.filter(
                        (item: Product) => item.id !== parseInt(product_id.value)
                      );

                      bumps.forEach((bump: Product) => {
                        const index = keys
                          .filter((key) => route.query[key] === bump.id.toString())
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
                              query[index] = route.query[index] + "-chc_" + sale.chc;
                            }
                          } else {
                            query[index] = route.query[index] + "-s_id_" + sale.sale_id;
                          }
                        }
                      });
                    }

                    const router = useRouter();
                    router.push({
                      path: `/${product_id.value}/obrigado`,
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
                .catch(err => {
                  console.error(err)
                  checkoutStore.setLoading(false);
                  this.setPaymentLoading(false);
                }).finally(() =>{
                  this.setPaymentFetching(false);
                  this.setPaymentLoading(false);
                })  
            }
          }
          catch (error) {
            // Se ocorrer um erro em qualquer uma das promessas, ele será capturado aqui
            console.error("Erro:", error);
          }
      } else {
        this.setPaymentFetching(false);
        this.setPaymentLoading(false);
      }
    },
    validateError(error: PaymentError) {
      checkoutStore.setLoading(false);
      this.loading = false;
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
    isPurcharseCard(card: any): card is PurcharseCard {
      return (
        typeof card.amount !== 'undefined' &&
        typeof card.card_cvv === 'string' &&
        typeof card.card_expiration_date === 'string' &&
        typeof card.card_holder_name === 'string' &&
        typeof card.card_number === 'string'
      );
    },
    getGateway(type: string, metodo: string, global_settings: GlobalSettingsCard[], installments: number | null, recipientIsActivated:boolean):any {
      
        const toast = Toast.useToast();
  
        //concatena type com method tranformando em letras Maiúsculas
        let gatewayKey = `${type.toUpperCase()}_${metodo.toUpperCase()}`;
        let result = "";

        switch (gatewayKey) {
          case 'TRANSACTION_CREDIT_CARD':
          case 'SUBSCRIPTION_CREDIT_CARD':
          case 'TRANSACTION_TWO_CREDIT_CARDS':
          case 'SUBSCRIPTION_TWO_CREDIT_CARDS':
          case 'TRANSACTION_BOLETO':
          case 'SUBSCRIPTION_BOLETO':
            result = 'PAGARME';
          case 'TRANSACTION_PIX':
          case 'SUBSCRIPTION_PIX':
            result = 'IUGU';
          case 'SUBSCRIPTION_CREDIT_CARD_DLOCAL':
          case 'TRANSACTION_CREDIT_CARD_DLOCAL':
            result = 'DLOCAL';
          default:
            result = "";
        }

        if (global_settings && global_settings.length > 0) {
          // Faz um find dentro das configurações globais
            const databaseConfiguration = global_settings.find(config => config.key === gatewayKey);

            // Se encontrar, retorna o valor correspondente
            if (databaseConfiguration) {
              result = databaseConfiguration.value;
            }
       

            const gatewayLowInstallment = global_settings.find(config => config.key === 'TRANSACTION_CREDIT_CARD_LOW_INSTALLMENT');
            let valuegatewayLowInstallment = null;

            if(gatewayLowInstallment){
              valuegatewayLowInstallment = gatewayLowInstallment.value;

              if(installments && installments <=2){
                // Se encontrar, retorna o valor correspondente
                if (gatewayLowInstallment) {
                  result = gatewayLowInstallment.value;
                }
              }

              if(result == 'PAGARME' && !recipientIsActivated && valuegatewayLowInstallment == 'IUGU'){
                result = 'IUGU';
              }
            }
        }

        if(result == ''){
          toast.warning("Erro ao buscar o gateway");
        }

        return result;
    },
    async cardGateway(dataGateway: any) {
      const toast = Toast.useToast();

      try {
        //Tem que passar true para dizer que é uma rota que usa o endpoint do gateway
        const response = await useApi().create("/checkout/card", dataGateway, null, true);
        return response;
      } catch (error) {
        // Tratar erros
        toast.warning("Falha ao obter o Gateway");
        throw error; // Lançar o erro novamente para que ele possa ser tratado onde a função cardGateway() foi chamada
      }
    },
    documentType(data: any):string {
       //Essa parte modifiquei pois o New Checkout não tem venda internacional
      return data.document.length > 14 ? 'cnpj' : 'cpf';
    },
    customerData(data: any): any {
      let document_number = data.document.replace(/\D/g, '');
      let document_type = this.documentType(data);
      let zipcodeFormatted = data.zipcode ? data.zipcode.slice(0, 5) + '-' + data.zipcode.slice(5) : null;
  
      let document = {};
          if (document_number) {
              document = {
                  document: {
                      type: document_type,
                      number: document_number,
                      document_type: document_type,
                      document_number: document_number
                  }
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
                      zipcode: zipcodeFormatted
                  }
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
              ...address
          };
    }
  },
});
