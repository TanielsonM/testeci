import { useCheckoutStore } from "@/store/checkout";
import { useCustomCheckoutStore } from "@/store/customCheckout";
import { formatMoney } from "~~/utils/money";
import { useInstallmentsStore } from "./modules/installments";
import { useAmountStore } from "./modules/amount";
const amountStore = useAmountStore();

export const useProductStore = defineStore("product", {
  state: () => ({
    product: [],
    amount: 0,
    original_amount: 0,
    is_gift: false,
    gift_message: "",
  }),
  getters: {
    seller_id: (state) => state.product.seller_id,
    product_id: (state) => state.product.id,
    isSubscription: (state) => state.product.type === "SUBSCRIPTION",
    isValid(state) {
      return () => {
        const checkout = useCheckoutStore();
        if (!state.product) return false;
        return (
          state.product?.status_offer === "APPROVED" &&
          state.product?.status_product === "APPROVED" &&
          state.product?.is_active == 1 &&
          checkout.isValid()
        );
      };
    },
    hasFees: (state) => !state.product.no_interest_installments, // 0 = sem juros | 1 = com juros
    isPhysicalProduct: (state) => state.product.format == "PHYSICALPRODUCT",
    productType: (state) => state.product.type,
    hasFixedInstallments: (state) => state.product.fixed_installments ?? null,
    hasPreSelectedInstallments: (state) =>
      state.product.pre_selected_installment ?? null,
    hasShippingFee: (state) => !!state.product.has_shipping_fee,
    allowedCoupon: (state) =>
      state.product.allowed_coupon &&
      state.product.format !== "PHYSICALPRODUCT",
    isHeaven: (state) => !!state.product.is_heaven,
    isFixedShipping: (state) => state.product.type_shipping_fee === "FIXED",
    FixedShippingAmount: (state) => state.product.amount_fixed_shipping_fee,
    showAddress: (state) => state.product.is_checkout_address,
    hasTrial: (state) => state.product.trial,
    getPeriod: (state) => state.product.period,
    hasCustomCharges: (state) => state.product.custom_charges ?? null,
    hasSubscriptionInstallments: (state) =>
      state.product.max_subscription_installments > 1 ?? null,
    hasTicketInstallments: (state) =>
      state.product.max_boleto_installments ?? null,
    canBeGifted: (state) => !!state.product.can_be_gifted,
    calculateAmountAfterTrial(state) {
      return () => {
        const store = useInstallmentsStore();
        const customCheckout = useCustomCheckoutStore();
        if (this.hasFixedInstallments && customCheckout.trial_info == "fixa") {
          return `${this.hasFixedInstallments}x de ${formatMoney(
            store.getInstallments(this.hasFixedInstallments)
          )}`;
        } else {
          if (state.product.shipping_fee_is_recurring && this.hasShippingFee) {
            if (state.product.type_shipping_fee === "FIXED") {
              return `${formatMoney(
                state.product.amount + state.product.amount_fixed_shipping_fee
              )}`;
            } else {
              if (state.product.shipping?.amount) {
                return `${formatMoney(
                  state.product.amount + state.product.shipping.amount
                )}`;
              }
              return `${formatMoney(state.product.amount)}`;
            }
          } else {
            return `${formatMoney(state.product.amount)}`;
          }
        }
      };
    },
    resolveInstallments(state) {
      return () => {
        if (
          this.product.type == "SUBSCRIPTION" &&
          this.product.period > 30 &&
          this.product.max_subscription_installments
        ) {
          return this.product.max_subscription_installments;
        }

        if (this.product.type == "SUBSCRIPTION" && this.product.period === 30) {
          return 1;
        }

        // quantidade de parcelas
        if (this.product.type == "TRANSACTION") {
          return this.product.max_installments || 12;
        }
        return 1;
      };
    },
    productName: (state) => state.product.name,
    seller_id: (state) => state.product.seller_id,
  },
  actions: {
    setProduct(product) {
      this.product = product;

      if (this.product.status_product === "CHANGED")
        this.product.status_product = "APPROVED";
      if (this.product.status_offer === "PENDING")
        this.product.status_offer = "APPROVED";

      this.amount = this.product.amount;
      this.original_amount = this.product.amount;

      const checkout = useCheckoutStore();
      checkout.setInstallments(
        this.product.pre_selected_installment ?? this.resolveInstallments(),
        this.product.max_installments ||
          this.product.max_subscription_installments ||
          12,
        this.hasFixedInstallments,
        this.hasTicketInstallments > 1 ? this.hasTicketInstallments : 1
      );
      checkout.setProductList(this.product);
      let allowed_methods = product.method.split(",");
      if (
        !!product.seller.is_heaven &&
        product.method.includes("PAYPAL") &&
        checkout.selectedCountry !== "BR"
      ) {
        allowed_methods = allowed_methods.filter((item) => item != "PAYPAL");
      }
      checkout.setAllowedMethods(allowed_methods);
    },
  },
});
