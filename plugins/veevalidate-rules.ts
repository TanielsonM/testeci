import { defineRule } from "vee-validate";
import { required, email, min, confirmed, max } from "@vee-validate/rules";
import { document } from "@/rules";

export default defineNuxtPlugin((nuxtApp) => {
  defineRule("confirmed", confirmed);
  defineRule("document", document);
  defineRule("required", required);
  defineRule("email", email);
  defineRule("min", min);
  defineRule("max", max);
});
