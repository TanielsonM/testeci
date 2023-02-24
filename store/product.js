import { useCheckoutStore } from "@/store/checkout.js";
export const useProductStore = definePiniaStore("product", {
  state: () => ({
    product: null,
  }),
  getters: {
    product_id: (state) => state.product.id,
    isSubscription: (state) => state.product.type === "SUBSCRIPTION",
    isValid: (state) =>
      state.product.status_offer === "APPROVED" &&
      state.product.status_product === "APPROVED" &&
      state.product.is_active == 1,
    hasFees: (state) => state.product.no_interest_installments, // com ou sem juros
    isPhysicalProduct: (state) => state.product.is_produto_fisico,
  },
  actions: {
    setProduct(product) {
      this.product = product;

      const checkout = useCheckoutStore();
      checkout.setAmount(product.amount);
      checkout.setOriginalAmount(product.amount);
      checkout.setAllowedMethods(product.method.split(","));
      checkout.setInstallments(
        this.product.max_installments,
        this.product.max_installments
      );
    },
  },
});
