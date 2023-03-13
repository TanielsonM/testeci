import { useCheckoutStore } from "@/store/checkout.js";
import { useCustomCheckoutStore } from "@/store/customCheckout";
import { formatMoney } from "~~/utils/money";
export const useProductStore = definePiniaStore("product", {
  state: () => ({
    product: null,
    amount: 0,
    original_amount: 0,
  }),
  getters: {
    product_id: (state) => state.product.id,
    isSubscription: (state) => state.product.type === "SUBSCRIPTION",
    isValid(state) {
      return () => {
        const checkout = useCheckoutStore();
        return (
          state.product.status_offer === "APPROVED" &&
          state.product.status_product === "APPROVED" &&
          state.product.is_active == 1 &&
          checkout.isValid()
        );
      };
    },
    hasFees: (state) => state.product.no_interest_installments, // com ou sem juros
    isPhysicalProduct: (state) => state.product.format == "PHYSICALPRODUCT",
    productType: (state) => state.product.type,
    hasFixedInstallments: (state) => state.product.fixed_installments ?? null,
    allowedCoupon: (state) => state.product.allowed_coupon,
    isHeaven: (state) => !!state.product.is_heaven,
    showAddress: (state) => state.product.is_checkout_address,
    hasTrial: (state) => state.product.trial,
    getPeriod: (state) => state.product.period,
    hasCustomCharges: (state) => state.product.custom_charges ?? null,
    calculateAmountAfterTrial(state) {
      return () => {
        const checkout = useCheckoutStore();
        const customCheckout = useCustomCheckoutStore();
        if (this.hasFixedInstallments && customCheckout.trial_info == "fixa") {
          return `${this.hasFixedInstallments}x de ${formatMoney(
            checkout.getInstallments(this.hasFixedInstallments)
          )}`;
        } else {
          if (state.product.shipping_fee_is_recurring) {
            if (state.product.type_shipping_fee === "FIXED") {
              return `${formatMoney(
                state.product.amount + state.product.amount_fixed_shipping_fee
              )}`;
            } else {
              return `${formatMoney(
                state.product.amount + state.product.shipping.amount
              )}`;
            }
          } else {
            return `${formatMoney(state.product.amount)}`;
          }
        }
      };
    },
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
      console.log(this.hasCustomCharges);
      checkout.setAmount(
        !!this.hasCustomCharges.length
          ? this.hasCustomCharges[0].amount
          : product.amount
      );
      console.log("aqui");
      checkout.setOriginalAmount(product.amount);
      checkout.setInstallments(
        this.product.max_installments,
        this.product.max_installments,
        this.hasFixedInstallments
      );
      checkout.setAllowedMethods(product.method.split(","));
      checkout.setProductList(this.product);
    },
  },
});
