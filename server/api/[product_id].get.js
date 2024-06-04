import { GreennLogs } from "@/utils/greenn-logs";

export default defineEventHandler(async (event) => {
  console.log(event)
  const config = useRuntimeConfig();
  const { product_id } = event.context.params;

  if (!product_id) {
    throw new Error('product_id não fornecido');
  }

  const sessionId = GreennLogs.getInternalContext()?.session_id ?? '';
  const requestHeaders = {
    "Content-Type": "application/json",
    "X-Session-Id": sessionId
  };

  try {
    const response = await fetch(`${config.public.API_BASE_URL}/product/test-checkout/${product_id}`, {
      method: 'GET',
      headers: requestHeaders,
    });

    if (!response.ok) {
      throw new Error(`Erro ao buscar produto ${product_id}`);
    }

    const responseHeaders = {
      "controller-token-": response.headers.get("controller-token-"),
      "requestray-token-": response.headers.get("requestray-token-"),
      "firewall-token-": response.headers.get("firewall-token-"),
      "cache-token-": response.headers.get("cache-token-"),
      "trans-token-": response.headers.get("trans-token-"),
    };
    setResponseHeaders(event, responseHeaders);

    return {
      statusCode: response.status,
      body: await response.json(),
      headers: responseHeaders
    };
  } catch (error) {
    return createError({
      statusCode: error.response?.status || 500,
      statusMessage: 'Erro ao processar a solicitação',
      message: error.message,
    });
  }
});
