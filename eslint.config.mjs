import eslint from "@eslint/js";
import globals from "globals";
import tseslint from "typescript-eslint";

export default tseslint.config(
  eslint.configs.recommended,
  ...tseslint.configs.recommended,
  {
    languageOptions: {
      globals: {
        ...globals.node,
      },
    },
  },

  {
    extends: ['eslint:recommended', 'plugin:@typescript-eslint/recommended', 'prettier'],
  },
  {
    rules: {
      "no-unused-vars": "error",
      "no-undef": "error",
      "prefer-const": "error",
      "no-console": "warn",
      "no-unused-expressions":"error"

    },
  },
  {
    ignores: ["**/node_modules/", "**/dist/"],
  }
);