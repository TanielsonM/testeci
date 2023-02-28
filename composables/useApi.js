export const useApi = async (url, method, configs) => {
  const config = useRuntimeConfig();
  const { data, error } = await useFetch(url, {
    ...configs,
    method,
    baseURL: config.public.baseURL,
  });
  if (!data.value) {
    throw createError({
      statusCode: 404,
      message: `Ocorreu um erro ao processar a sua solicitação`,
    });
  }

  return data.value;
};
