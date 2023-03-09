export default function () {
  async function instance<T>(
    url: string,
    method: "get" | "post" | "put" | "delete",
    config?: any,
    body: any = null
  ): Promise<T> {
    if (body) config.body = body;
    const { data, error } = await useFetch<T>(url, {
      ...config,
      method,
      baseURL: useRuntimeConfig().public.API_BASE_URL,
      headers: {
        "Content-type": "application/json",
      },
    });
    if (error.value) {
      throw showError({
        statusCode: error.value.statusCode,
        message: `Ocorreu um erro ao processar a sua solicitação`,
      });
    }
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
