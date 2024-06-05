import FingerprintJS from "@fingerprintjs/fingerprintjs-pro";

export const useFingerprint = () => {
  const response = ref<null | string>(null);
  const config = useRuntimeConfig();

  const requestLoad = async (): Promise<{
    requestId: null | string;
  }> => {
    if (process.client) {
      try {
        const fpPromise = FingerprintJS.load({
          apiKey: config.public.FINGERPRINT_API_KEY,
          endpoint: [config.public.FINGERPRINT_ENDPOINT],
          scriptUrlPattern: [
            ${config.public.FINGERPRINT_PATH}?apiKey=<apiKey>&version=<version>&loaderVersion=<loaderVersion>,
          ],
        });
        const { requestId } = await (await fpPromise).get();
        response.value = requestId;
      } catch (error: any) {
        const errorMessage = error.message || "Unknown error";
        GreennLogs.logger.error("ErrorFingerPrint", {
          name: "ErrorFingerPrint",
          error_code: error.code || null,
          error_message: errorMessage,
        });
        response.value = "fingerprint_error";
      }
    }

    return { requestId: response.value };
  };

  return requestLoad;
};