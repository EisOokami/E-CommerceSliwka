import js from "@eslint/js";
import tseslint from "typescript-eslint";
import globals from "globals";

export default tseslint.config(
    {
        ignores: ["dist/**", "node_modules/**", "uploads/**"],
    },
    js.configs.recommended,
    ...tseslint.configs.recommended,
    { languageOptions: { globals: globals.node } },
    {
        files: ["src/**/*.ts"],
        languageOptions: {
            parserOptions: {
                projectService: true,
            },
        },
        rules: {
            "@typescript-eslint/no-floating-promises": [
                "error",
                { checkThenables: true },
            ],
        },
    },
);
