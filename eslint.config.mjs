import { base as eslintConfigWantedlyTs } from "eslint-config-wantedly-typescript";

/** @type{import('eslint').Linter.Config[]} */
export default [
  ...eslintConfigWantedlyTs,
  {
    name: "targets",
    files: ["packages/**/*.ts"],
  },
  {
    languageOptions: {
      ecmaVersion: "latest",
      parserOptions: {
        project: "./tsconfig.json",
      },
    },
    settings: {
      react: {
        version: "18.3",
        // version: "detect",
      },
    },
    rules: {
      "no-console": "off",
      "@typescript-eslint/no-require-imports": "off",
      "@typescript-eslint/consistent-type-imports": [
        "error",
        {
          prefer: "type-imports",
          disallowTypeAnnotations: true,
        },
      ],
    },
  },
];
