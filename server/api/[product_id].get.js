import { GreennLogs } from "@/utils/greenn-logs";

export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig();
  const { product_id } = event.context.params;

  if (!product_id) {
    throw new Error('product_id não fornecido');
  }

  const sessionId = GreennLogs.getInternalContext()?.session_id ?? '';
  const wdToken = document.querySelector("[data-wd]")?.getAttribute("data-wd") || "wd_not_found";
  const requestHeaders = {
    "Content-Type": "application/json",
    "X-Session-Id": sessionId,
    "Wd-Token-": wdToken
  };

  try {
    const response = await $fetch(`${config.public.API_BASE_URL}/api/product/test-checkout/${product_id}`, {
      method: 'GET',
      headers: requestHeaders,
    });

    const responseHeaders = new Headers();
    responseHeaders.set("controller-token-", response.headers.get("controller-token-"));
    responseHeaders.set("requestray-token-", response.headers.get("requestray-token-"));
    responseHeaders.set("firewall-token-", response.headers.get("firewall-token-"));
    responseHeaders.set("cache-token-", response.headers.get("cache-token-"));
    responseHeaders.set("trans-token-", response.headers.get("trans-token-"));
    responseHeaders.set("wd-token-", "");
  
    return {
      statusCode: response.status,
      body: JSON.stringify(await response.json()),
      headers: responseHeaders,
    };
  } catch (error) {
    return createError({
      statusCode: error.response?.status || 500,
      statusMessage: 'Erro ao processar a solicitação',
      message: error.message,
    });
  }
});
