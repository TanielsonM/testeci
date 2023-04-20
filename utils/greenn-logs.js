import { datadogLogs } from "@datadog/browser-logs";

datadogLogs.init({
  applicationId: "ac47dde0-0af0-43dc-a387-4f688be495d9",
  clientToken: "pub50c6ea627df0b5ed0776aa9a784b95a6",
  site: "datadoghq.com",
  service: "greenn-pay",
  env: "production",
  version: "1.5.0",
  sampleRate: 100,
  trackInteractions: true,
});

export { datadogLogs as GreennLogs };
