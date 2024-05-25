import FingerprintJS from '@fingerprintjs/fingerprintjs-pro';
import { useRuntimeConfig } from 'nuxt/app';

export const useFingerprint = async () => {
    const response = ref<null | string>(null);
    const config = useRuntimeConfig();
    const apiKey = config.public.FINGERPRINT_API_KEY;

    try {
        const fpPromise = FingerprintJS.load({ apiKey });
        const { requestId } = await (await fpPromise).get();
        response.value = requestId
    } catch (err) {
        GreennLogs.logger.error("fingerprint_error", {
            name: "fingerprint_error",
            error_code: err ? err.code : null,
            error_mensage: err.message,
        });
        response.value = 'fingerprint_error'

    }

    return { requestId: response.value };
};




