import { useLoadingStore } from "@/store/loading/loading";
const loading = useLoadingStore();

export default function () {
  async function instance<T>(
    url: string,
    method: "get" | "post" | "put" | "delete",
    config?: any,
    body: any = null
  ): Promise<T | any> {
    if (body) config = { body };
    loading.changeLoading();

    const { data, error } = await useFetch<T>(url, {
      ...config,
      method,
      baseURL: useRuntimeConfig().public.API_BASE_URL,
      headers: {
        "Content-type": "application/json",
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
