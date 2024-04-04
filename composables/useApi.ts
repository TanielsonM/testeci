// Types
import { HeadersState } from "@/types";

// Utils
import { GreennLogs } from "@/utils/greenn-logs";

import { useLoadingStore } from "@/store/loading/loading";

import { MD5 } from 'crypto-js';
const loading = useLoadingStore();
const headStore = useHeadersStore();

export default function () {
  async function instance<T>(
    url: string,
    method: "get" | "post" | "put" | "delete",
    config?: any,
    body: any = null,
    useGateway: boolean = false
  ): Promise<T | any> {
    if (body) config = { body };
    const { data, error } = await useFetch<T>(url, {
      ...config,
      method,
      baseURL: useGateway ? useRuntimeConfig().API_GATEWAY_URL : useRuntimeConfig().public.API_BASE_URL,
      onRequest({ request, options }) {
        loading.changeLoading(request.toString());
        const headers: HeadersInit = new Headers();
        headers.set("Content-type", "application/json");
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
          // wd-token-
          headers.set(
            "Wd-Token-",
            document.querySelector("[data-wd]")?.getAttribute("data-wd") ||
              "wd_not_found"
          );

          GreennLogs.logger.info("axiosRequest", {
            axiosRequest: options,
          });
        }
        if (request === "/checkout/card") {
          let apiKey = useRuntimeConfig().public.CHECKOUT_GATEWAY_KEY;
          // Gera um salt aleatório
          const salt = Math.floor(1000 + Math.random() * 9000).toString();
          // Gera um número aleatório de iterações entre 1 e 10
          const iterations = Math.floor(1 + Math.random() * 10);
          let textWithSalt = apiKey + salt;       
          // Realiza a iteração adicionando o salt ao texto várias vezes
          for (let i = 0; i < iterations; i++) {
            textWithSalt = MD5(textWithSalt).toString();
          }
          const encrypted = textWithSalt + salt + iterations;
          headers.set("X-Greenn-Gateway", encrypted);
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
            "wd-token-": "",
          };

          headStore.updateHeaders(headers);
        }
      },
    });

    if (error.value?.statusCode === 500) {
      loading.changeLoading();

      throw showError({
        statusCode: error.value.statusCode,
        message: `Ocorreu um erro ao processar a sua solicitação`,
      });
    }
    if (error.value) {
      loading.changeLoading();
      throw error;
    }

    loading.changeLoading();

    const retorno: T | any = data.value;
    return retorno;
  }

   // Adiciona useGateway como parâmetro na chamada de instance
  async function read<T>(url: string, config?: any, useGateway: boolean = false) {
    return await instance<T>(url, "get", config, null, useGateway);
  }

  async function create<T>(url: string, body?: any, config?: any, useGateway: boolean = false) {
    return await instance<T>(url, "post", config, body, useGateway);
  }

  async function update<T>(url: string, body?: any, config?: any, useGateway: boolean = false) {
    return await instance<T>(url, "put", config, body, useGateway);
  }

  async function remove<T>(url: string, config?: any, useGateway: boolean = false) {
    return await instance<T>(url, "delete", config, null, useGateway);
  }

  return {
    read,
    create,
    update,
    remove,
  };
}
