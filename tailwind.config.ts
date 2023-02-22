import type { Config } from "tailwindcss";

export default <Partial<Config>>{
  content: [
    "./components/**/*.{js,vue,ts}",
    "./layouts/**/*.vue",
    "./pages/**/*.vue",
    "./plugins/**/*.{js,ts}",
  ],
  theme: {
    extend: {
      colors: {
        greenn: "var(--greenn)",
        background: "var(--background)",
        checkout: "var(--checkout)",
        "txt-color": "var(--txt-color)",
        "main-color": "var(--main-color)",
        "main-transparent-color": "var(--transparent-color)",
        "main-transparent": "var(--transparent)",
        "bd-color": "var(--border-color)",
      },
    },
  },
};
