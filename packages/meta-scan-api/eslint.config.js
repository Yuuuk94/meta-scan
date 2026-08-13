// @ts-check
import tsParser from "@typescript-eslint/parser";
import tsPlugin from "@typescript-eslint/eslint-plugin";
import { sharedIgnores, sharedTypeScriptRules } from "../../eslint.config.base.mjs";

export default [
  {
    ignores: ["dist/**", "node_modules/**", ...sharedIgnores],
  },
  {
    files: ["src/**/*.ts"],
    languageOptions: {
      parser: tsParser,
      parserOptions: {
        sourceType: "module",
      },
    },
    plugins: {
      "@typescript-eslint": tsPlugin,
    },
    rules: {
      ...tsPlugin.configs.recommended.rules,
      ...sharedTypeScriptRules,
    },
  },
];
