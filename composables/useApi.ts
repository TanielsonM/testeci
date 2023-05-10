// Types
import { HeadersState } from "@/types";

import { useLoadingStore } from "@/store/loading/loading";
const loading = useLoadingStore();
const headStore = useHeadersStore();

export default function () {
  async function instance<T>(
    url: string,
    method: "get" | "post" | "put" | "delete",
    config?: any,
    body: any = null
  ): Promise<T | any> {
    if (body) config = { body };
    const { data, error } = await useFetch<T>(url, {
      ...config,
      method,
      baseURL: useRuntimeConfig().public.API_BASE_URL,
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
          if (headStore["wd-token-"]) {
            headers.set("Wd-Token-", headStore["wd-token-"]);
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

  async function read<T>(url: string, config?: any) {
    return await instance<T>(url, "get", config);
  }

  async function create<T>(url: string, body?: any, config?: any) {
    return await instance<T>(url, "post", config, body);
  }

  async function update<T>(url: string, body?: any, config?: any) {
    return await instance<T>(url, "put", config, body);
  }

  async function remove<T>(url: string, config?: any) {
    return await instance<T>(url, "delete", config);
  }

  return {
    read,
    create,
    update,
    remove,
  };
}
