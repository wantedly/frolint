import { base as eslintConfigWantedly } from "eslint-config-wantedly";
import { base as eslintConfigWantedlyTs } from "eslint-config-wantedly-typescript";

/** @type{import('eslint').Linter.Config[]} */
export default [
  ...eslintConfigWantedly,
  ...eslintConfigWantedlyTs,
  {
    files: ["**/*.ts", "**/*.tsx"],
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
      "import/order": [
        "error",
        {
          "newlines-between": "always",
          groups: ["builtin", "external", "parent", "sibling", "index"],
          alphabetize: {
            order: "asc",
          },
        },
      ],
    },
  },
];
