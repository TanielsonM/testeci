import FingerprintJS from '@fingerprintjs/fingerprintjs-pro';
import { useRuntimeConfig } from 'nuxt/app';

export const useFingerprint = async () => {
    const response = ref<null | string>(null);
    const config = useRuntimeConfig();
    const apiKey = config.public.FINGERPRINT_API_KEY;
    if (process.client) {
        try {
            const fpPromise = FingerprintJS.load({ apiKey });
            const { requestId } = await (await fpPromise).get();
            response.value = requestId
        } catch (error) {
            const errorMessage = error.message || 'Unknown error';
            GreennLogs.logger.error("ErrorFingerPrint", {
                name: "ErrorFingerPrint",
                error_code: error.code || null,
                error_message: errorMessage,
            });
            response.value = 'fingerprint_error';
        }
    }

    return { requestId: response.value };
};




