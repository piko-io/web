import { dirname } from "path";
import { fileURLToPath } from "url";
import { FlatCompat } from "@eslint/eslintrc";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const compat = new FlatCompat({
  baseDirectory: __dirname,
});

export default [
  ...compat.extends(
    "next/core-web-vitals",
    "plugin:@typescript-eslint/recommended",
    "prettier"
  ),
  {
    plugins: ["@typescript-eslint", "prettier"],
    languageOptions: {
      parser: "@typescript-eslint/parser",
    },
    rules: {
      "no-undef": "off",
      "prettier/prettier": "error",
      "@typescript-eslint/no-explicit-any": "off",
      "no-unused-vars": "warn",
    },
  },
];
