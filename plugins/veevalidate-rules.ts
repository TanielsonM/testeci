import { defineRule } from "vee-validate";
import { required, email, min, confirmed } from "@vee-validate/rules";
import { document } from "@/rules";

export default defineNuxtPlugin((nuxtApp) => {
  defineRule("confirmed", confirmed);
  defineRule("document", document);
  defineRule("required", required);
  defineRule("email", email);
  defineRule("min", min);
});
