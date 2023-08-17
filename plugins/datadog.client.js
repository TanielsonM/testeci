import { datadogRum } from '@datadog/browser-rum';

export default () => {

    datadogRum.init({
        applicationId: 'e1cc00a3-24a4-4b64-af20-d5653f203df7',
        clientToken: 'pub5e327407f462e8c7f771a2a6a4ed5b25',
        site: 'datadoghq.com',
        service: 'payfast',
        env: 'production',
        version: '1.0.0',
        sessionSampleRate: 100,
        sessionReplaySampleRate: 20,
        trackUserInteractions: true,
        trackResources: true,
        trackLongTasks: true,
        defaultPrivacyLevel: 'mask-user-input'
    });

    datadogRum.startSessionReplayRecording();
}