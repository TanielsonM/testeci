import { useProductStore } from "@/store/product.js";
import { useCustomCheckoutStore } from "@/store/customCheckout.js";
import { useCheckoutStore } from "@/store/checkout.js";

type Query = {
  country?: string;
};

type ProductResponse = {
  data: object;
  custom_checkout: object;
};

export const useGetProduct = async (
  id: string | number,
  offer: string | null = null,
  country: string | null = null,
  configs: any = {}
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
  let query: Query = {};
  if (country) query.country = country;
  if (checkoutStore.global_settings.country !== "BR" && !country) {
    query.country = checkoutStore.global_settings.country;
  }

  try {
    const response: ProductResponse = await useApi().read<ProductResponse>(
      url,
      {
        ...configs,
        query,
      }
    );
    if (response?.data) setProduct(response.data);
    if (response?.custom_checkout && customThemeId) {
      setCustomCheckout(response.custom_checkout);
    }
    return response?.data;
  } catch (error) {
    checkoutStore.setError("Ocorreu um erro ao processar os dados do produto");
    checkoutStore.setLoading();
  }
};
