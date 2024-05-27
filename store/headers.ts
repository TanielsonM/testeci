import { type HeadersState } from "@/types";
import { defineStore } from "pinia";

export const useHeadersStore = defineStore("", {
  state: (): HeadersState => ({
    "controller-token-": "",
    "requestray-token-": "",
    "firewall-token-": "",
    "cache-token-": "",
    "trans-token-": "",
    "wd-token-": "",
  }),
  actions: {
    updateHeaders(headers: HeadersState) {
      this["controller-token-"] = headers["controller-token-"];
      this["requestray-token-"] = headers["requestray-token-"];
      this["firewall-token-"] = headers["firewall-token-"];
      this["cache-token-"] = headers["cache-token-"];
      this["trans-token-"] = headers["trans-token-"];
      this["wd-token-"] = headers["wd-token-"];
    },
  },
});
