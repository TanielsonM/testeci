import { useCheckoutStore } from "@/store/checkout.js";
export const useProductStore = definePiniaStore("product", {
  state: () => ({
    product: null,
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
  },
  actions: {
    setProduct(product) {
      this.product = product;

      if (this.product.status_product === "CHANGED")
        this.product.status_product = "APPROVED";
      if (this.product.status_offer === "PENDING")
        this.product.status_offer = "APPROVED";

      const checkout = useCheckoutStore();
      checkout.setAmount(product.amount);
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
