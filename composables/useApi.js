export const useApi = async (url, method, configs) => {
  const config = useRuntimeConfig();
  const { data, error } = await useFetch(url, {
    ...configs,
    method,
    baseURL: config.public.API_BASE_URL,
  });
  if (error.value) {
    throw showError({
      statusCode: error.value.statusCode,
      message: `Ocorreu um erro ao processar a sua solicitação`,
    });
  }

  return data.value;
};
