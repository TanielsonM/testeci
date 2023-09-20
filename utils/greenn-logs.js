import { datadogLogs } from "@datadog/browser-logs";

datadogLogs.init({
  clientToken: "puba58e2b765f79988ed1a6b3018c7b90d3",
  site: "datadoghq.com",
  service: "payfast",
  env: "production",
  version: "1.0.0",
  sampleRate: 100,
  trackInteractions: true,
});

export { datadogLogs as GreennLogs };
