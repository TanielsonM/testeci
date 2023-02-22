module.exports = {
  root: true,
  env: {
    browser: true,
    node: true,
  },
  parser: ["vue-eslint-parser", "@typescript-eslint/parser"],
  parserOptions: {
    parser: "@typescript-eslint/parser",
  },
  extends: ["plugin:prettier/recommended"],
  plugins: ["@typescript-eslint"],
  rules: {},
};
