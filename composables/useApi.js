export const useApi = async (url, method, configs) => {
  const config = useRuntimeConfig();
  const { data, error } = await useFetch(url, {
    ...configs,
    method,
    baseURL: config.public.baseURL,
  });
  
  if (error.value) {
    return {
      hasError: true,
      status: error.value.statusCode,
      message: error.value.statusMessage
    }
  }

  return data;
};
