import { defineRule } from "vee-validate";
import { required, email, min, confirmed } from "@vee-validate/rules";

export default defineNuxtPlugin((nuxtApp) => {
  defineRule("confirmed", confirmed);
  defineRule("required", required);
  defineRule("email", email);
  defineRule("min", min);
});
