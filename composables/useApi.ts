// Types
import { HeadersState } from "@/types";

// Utils
import { GreennLogs } from "@/utils/greenn-logs";

import { useLoadingStore } from "@/store/loading/loading";
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
        if (request === "/card") {
          headers.set("X-Greenn-Gateway", useRuntimeConfig().public.API_GATEWAY_KEY);
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
