export const useApiFast = () => {
    const isProductApiFast = (productId: string): boolean => {
      const { PRODUCT_TO_API_FAST } = useRuntimeConfig().public;

      if (PRODUCT_TO_API_FAST.includes(productId)) {
        return true;
      }

      return false;
    };

    return {
        isProductApiFast
    }
}