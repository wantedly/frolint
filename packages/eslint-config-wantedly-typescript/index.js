const config = require("eslint-config-wantedly-base");
const { rules, ...rest } = config;

module.exports = {
  ...rest,
  extends: [
    "plugin:react/recommended",
    "plugin:@typescript-eslint/recommended",
    "prettier",
    "prettier/@typescript-eslint",
  ],
  parser: "@typescript-eslint/parser",
  plugins: ["react", "import", "jsx-a11y", "jest", "prettier", "@typescript-eslint"],
  rules: {
    ...rules,

    "no-unused-vars": "off",

    // @typescript-eslint/eslint-plugin rules
    "@typescript-eslint/explicit-function-return-type": ["off"],
    "@typescript-eslint/indent": [
      "error",
      2,
      {
        flatTernaryExpressions: false,
        ignoredNodes: ["CallExpression", "ConditionalExpression", "LogicalExpression", "JSXElement"],
        SwitchCase: 1,
      },
    ],
    "@typescript-eslint/no-explicit-any": ["off"],
    "@typescript-eslint/no-unused-vars": [
      "error",
      {
        varsIgnorePattern: "^_",
        argsIgnorePattern: "^_",
      },
    ],
    "@typescript-eslint/no-use-before-define": "off",
  },
};
