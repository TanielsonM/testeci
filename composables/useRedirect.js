export const useRedirect = async (page) => {
  await useApi(`/link/${page}`, "get").then((res) => {
    if (res.value.url)
      navigateTo(res.value.url, {
        external: true,
      });
  });
};
