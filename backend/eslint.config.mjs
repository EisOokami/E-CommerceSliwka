import js from "@eslint/js";
import tseslint from "typescript-eslint";
import globals from "globals";

export default tseslint.config(
    { ignores: ["dist/**", ".test-runtime/**", "node_modules/**", "uploads/**"] },
    js.configs.recommended,
    ...tseslint.configs.recommended,
    { languageOptions: { globals: globals.node } },
);
