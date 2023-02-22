import { useProductStore } from "@/stores/product.js";
import { useCustomCheckoutStore } from "@/stores/customCheckout.js";
import { useProductsStore } from "@/stores/products.js";

export const useGetProduct = async (id, offer = null, configs = {}) => {
  const productsStore = useProductsStore()
  const productStore = useProductStore();
  const customCheckoutStore = useCustomCheckoutStore();
  const { setProduct } = productStore;
  const { setCustomCheckout } = customCheckoutStore;

  const route = useRoute();
  const customThemeId = route.query["ch_id"];

  let url = "";
  if (customThemeId) {
    url = offer
      ? `/product/checkout/${id}/checkout/${customThemeId}/offer/${offer}`
      : `/product/checkout/${id}/checkout/${customThemeId}`;
  } else {
    url = offer
      ? `/product/checkout/${id}/offer/${offer}`
      : `/product/checkout/${id}`;
  }

  const data = await useApi(url, "get", configs);

  if (data.hasError) {
    throw createError({
      statusCode: data.status,
      message: `Ocorreu um erro ao processar a sua solicitação`,
    });
    return;
  }

  setProduct(data.value?.data);
  productsStore.addProduct(data.value?.data)

  if (data.value?.custom_checkout && customThemeId) {
    setCustomCheckout(data.value.custom_checkout);
  }
  if (data.value?.checkout_payment) {
    useState("checkout_payment", () => ref(data.value.checkout_payment));
  }

  return data.value?.data;
};
