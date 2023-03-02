import { useProductStore } from "@/store/product.js";
import { useCustomCheckoutStore } from "@/store/customCheckout.js";
import { useCheckoutStore } from "@/store/checkout.js";

export const useGetProduct = async (
  id,
  offer = null,
  country = null,
  configs = {}
) => {
  const productStore = useProductStore();
  const checkoutStore = useCheckoutStore();
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
  let query = {};
  if (country) query.country = country;
  if (checkoutStore.global_settings.country !== "BR" && !country) {
    query.country = checkoutStore.global_settings.country;
  }

  try {
    const data = await useApi(url, "get", { ...configs, query });
    setProduct(data.data);
    if (data?.custom_checkout && customThemeId) {
      setCustomCheckout(data.custom_checkout);
    }
    return data?.data;
  } catch (error) {
    checkoutStore.setError(true);
    checkoutStore.setLoading();
  }
};
