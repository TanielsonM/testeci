import { GreennLogs } from "@/utils/greenn-logs";
import { useHeadersStore } from "~~/store/headers";

export default defineEventHandler(async (event) => {
  const { product_id } = event.context.params;
  if (!product_id) {
    throw new Error('product_id não fornecido');
  }

  const { url, useNewProductApi } = getQuery(event);  
  const { API_BASE_URL, API_HOST_PRODUCT } = useRuntimeConfig().public;
  const baseURL = JSON.parse(useNewProductApi) ? API_HOST_PRODUCT : API_BASE_URL;

  const sessionId = GreennLogs.getInternalContext()?.session_id ?? '';
  const requestHeaders = {
    "Content-Type": "application/json",
    "X-Session-Id": sessionId
  };

  try {
    const response = await fetch(`${baseURL}${url}`, {
      method: 'GET',
      headers: requestHeaders,
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Erro ao buscar produto ${product_id}: ${errorText}`);
    }

    const responseHeaders = {
      "controller-token-": response.headers.get("controller-token-"),
      "requestray-token-": response.headers.get("requestray-token-"),
      "firewall-token-": response.headers.get("firewall-token-"),
      "cache-token-": response.headers.get("cache-token-"),
      "trans-token-": response.headers.get("trans-token-"),
    };
    setResponseHeaders(event, responseHeaders);
    const headStore = useHeadersStore();
    headStore.updateHeaders(responseHeaders);

    return await response.json();
  } catch (error) {
    return createError({
      statusCode: error.response?.status || 500,
      statusMessage: 'Erro ao processar a solicitação: '+error,
      message: error.message,
    });
  }
});
