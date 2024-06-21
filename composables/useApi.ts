// Types
import { HeadersState } from "@/types";

// Utils
import { GreennLogs } from "@/utils/greenn-logs";

import { useLoadingStore } from "@/store/loading/loading";
import md5 from "crypto-js/md5";

export default function () {
  const loading = useLoadingStore();
  const headStore = useHeadersStore();

  async function instance<T>(
    url: string,
    method: "get" | "post" | "put" | "delete",
    config?: any,
    body: any = null,
    useGateway: boolean = false,
    useProductApi: boolean = false,
    isErrorApi: boolean = false
  ): Promise<T | any> {
    if (body) config = { body };

    const {
      API_GATEWAY_URL,
      API_BASE_URL,
      API_HOST_PRODUCT,
      CHECKOUT_GATEWAY_KEY,
      FINGERPRINT_API_KEY,
    } = useRuntimeConfig().public;

    let baseURL: string = API_BASE_URL;

    if (useGateway || useProductApi) {
      baseURL = useGateway ? API_GATEWAY_URL : API_HOST_PRODUCT;
    }

    let fingerprintRequestId: { requestId: string | null } | null = null;

    if (url === "/checkout/card" || url === "/payment") {
      fingerprintRequestId = await useFingerprint();
    }

    const { data, error } = await useFetch<T>(url, {
      ...config,
      method,
      baseURL,
      onRequest({ request, options }) {
        const sessionId = GreennLogs.getInternalContext()?.session_id ?? "";
        loading.changeLoading(request.toString());
        const headers: HeadersInit = new Headers();
        headers.set("Content-type", "application/json");
        headers.set("X-Session-Id", sessionId);

        if (request === "/payment") {
          // controller-token-
          if (headStore["controller-token-"]) {
            headers.set("Controller-Token-", headStore["controller-token-"]);
          }
          // requestray-token-
          if (headStore["requestray-token-"]) {
            headers.set("RequestRay-Token-", headStore["requestray-token-"]);
          }
          // firewall-token-
          if (headStore["firewall-token-"]) {
            headers.set("Firewall-Token-", headStore["firewall-token-"]);
          }
          // cache-token-
          if (headStore["cache-token-"]) {
            headers.set("Cache-Token-", headStore["cache-token-"]);
          }
          // trans-token-
          if (headStore["trans-token-"]) {
            headers.set("Trans-Token-", headStore["trans-token-"]);
          }
          if (fingerprintRequestId && fingerprintRequestId.requestId) {
            headers.set(
              "X-Fingerprint-RID",
              fingerprintRequestId.requestId.toString()
            );

            GreennLogs.logger.info("axiosRequest.payment", {
              axiosRequest: config,
              extra: {
                fingerprint_request_id:
                  fingerprintRequestId.requestId.toString() ?? "",
              },
            });
          }
          GreennLogs.logger.info("axiosRequest", {
            axiosRequest: options,
          });
        }
        if (request === "/checkout/card") {
          let apiKey = CHECKOUT_GATEWAY_KEY;
          // Gera um salt aleatório
          const salt = Math.floor(1000 + Math.random() * 9000).toString();
          // Gera um número aleatório de iterações entre 1 e 10
          const iterations = Math.floor(1 + Math.random() * 10);
          let textWithSalt = apiKey + salt;
          // Realiza a iteração adicionando o salt ao texto várias vezes
          for (let i = 0; i < iterations; i++) {
            textWithSalt = md5(textWithSalt).toString();
          }
          const encrypted = textWithSalt + salt + iterations;

          headers.set("X-Greenn-Gateway", encrypted);

          // Define o x-fingerprint-rid se tiver valor dentro do fingerprintRequestId
          if (fingerprintRequestId && fingerprintRequestId.requestId) {
            headers.set(
              "X-Fingerprint-RID",
              fingerprintRequestId.requestId.toString()
            );

            GreennLogs.logger.info("axiosRequest.card", {
              axiosRequest: config,
              extra: {
                fingerprint_request_id:
                  fingerprintRequestId.requestId.toString() ?? "",
              },
            });
          }
        }
        options.headers = headers;
      },
      onResponse({ request, response }) {
        if (request.toString().includes("/api/product")) {
          const headers: HeadersState = {
            "controller-token-": response.headers.get("controller-token-"),
            "requestray-token-": response.headers.get("requestray-token-"),
            "firewall-token-": response.headers.get("firewall-token-"),
            "cache-token-": response.headers.get("cache-token-"),
            "trans-token-": response.headers.get("trans-token-"),
          };

          headStore.updateHeaders(headers);
        }
      },
    });

    if (error.value) {
      loading.changeLoading();

      if (isErrorApi) {
        handleApiError(error.value, url);
      }
    }

    function handleApiError(error, url) {
      const baseErrorMessages = {
        400: "Requisição inválida. Verifique os dados enviados.",
        401: "Não autorizado.",
        403: "Acesso negado.",
        404: "Recurso não encontrado. Verifique o endereço solicitado.",
        500: "Erro interno. Tente novamente.",
        502: "O servidor obteve uma resposta inválida.",
        503: "Serviço indisponível.",
        504: "O servidor demorou para responder.",
      };

      const defaultMessage = "Ocorreu um erro desconhecido. Tente novamente.";

      if (url.includes("link") && error.statusCode === 404) {
        throw showError({
          statusCode: 404,
          message: "Este link não existe ou não está disponível.",
        });
      } else if (url.includes("product") && error.statusCode === 404) {
        throw showError({
          statusCode: 404,
          message: "Este produto não existe ou não está disponível.",
        });
      } else if (url.includes("calculate") && error.statusCode === 422) {
        const customError = new Error("Esse produto não possui integração para envio.");
        customError.status = 422;
        throw customError;
      }

      const message = baseErrorMessages[error.statusCode] || defaultMessage;

      throw showError({
        statusCode: error.statusCode,
        message: message,
      });
    }

    loading.changeLoading();

    const retorno: T | any = data.value;
    return retorno;
  }

  // Adiciona useGateway como parâmetro na chamada de instance
  async function read<T>(
    url: string,
    config?: any,
    useGateway: boolean = false,
    useProductApi: boolean = false,
    isErrorApi: boolean = false
  ) {
    return await instance<T>(
      url,
      "get",
      config,
      null,
      useGateway,
      useProductApi,
      isErrorApi
    );
  }

  async function create<T>(
    url: string,
    body?: any,
    config?: any,
    useGateway: boolean = false,
    useProductApi: boolean = false,
    isErrorApi: boolean = false
  ) {
    return await instance<T>(
      url,
      "post",
      config,
      body,
      useGateway,
      useProductApi,
      isErrorApi
    );
  }

  async function update<T>(
    url: string,
    body?: any,
    config?: any,
    useGateway: boolean = false,
    useProductApi: boolean = false,
    isErrorApi: boolean = false
  ) {
    return await instance<T>(
      url,
      "put",
      config,
      body,
      useGateway,
      useProductApi,
      isErrorApi
    );
  }

  async function remove<T>(
    url: string,
    config?: any,
    useGateway: boolean = false,
    isErrorApi: boolean = false
  ) {
    return await instance<T>(
      url,
      "delete",
      config,
      null,
      useGateway,
      isErrorApi
    );
  }

  return {
    read,
    create,
    update,
    remove,
  };
}
