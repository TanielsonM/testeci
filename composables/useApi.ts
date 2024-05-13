// useApi.ts

// Importações de tipos e utilitários
import { type HeadersState } from "@/types";
import { GreennLogs } from "@/utils/greenn-logs";
import md5 from "crypto-js/md5";
import { useLoadingStore } from "@/store/loading/loading";
import { useHeadersStore } from "@/store/headers";

export default function () {
  let loading;
  let headStore;

  async function instance<T>(
    url: string,
    method: "get" | "post" | "put" | "delete",
    config?: any,
    body: any = null,
    useGateway: boolean = false
  ): Promise<T | any> {
    // Garantindo a inicialização dos stores dentro do contexto de uso
    if (!loading || !headStore) {
      loading = useLoadingStore();
      headStore = useHeadersStore();
    }

    if (body) config = { body };
    const { data, error } = await useFetch<T>(url, {
      ...config,
      method,
      baseURL: useGateway
        ? useRuntimeConfig().API_GATEWAY_URL
        : useRuntimeConfig().public.API_BASE_URL,
      onRequest({ request, options }) {
        loading.changeLoading(request.toString());
        const headers: HeadersInit = new Headers();
        headers.set("Content-type", "application/json");
        // Manipulação de headers específicos para diferentes endpoints
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
      throw new Error(
        `Ocorreu um erro ao processar a sua solicitação: ${error.value.statusCode}`
      );
    }
    if (error.value) {
      loading.changeLoading();
      throw error;
    }

    loading.changeLoading();
    return data.value;
  }

  async function read<T>(
    url: string,
    config?: any,
    useGateway: boolean = false
  ) {
    return await instance<T>(url, "get", config, null, useGateway);
  }

  async function create<T>(
    url: string,
    body?: any,
    config?: any,
    useGateway: boolean = false
  ) {
    return await instance<T>(url, "post", config, body, useGateway);
  }

  async function update<T>(
    url: string,
    body?: any,
    config?: any,
    useGateway: boolean = false
  ) {
    return await instance<T>(url, "put", config, body, useGateway);
  }

  async function remove<T>(
    url: string,
    config?: any,
    useGateway: boolean = false
  ) {
    return await instance<T>(url, "delete", config, null, useGateway);
  }

  return {
    read,
    create,
    update,
    remove,
  };
}
