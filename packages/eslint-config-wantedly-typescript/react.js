const { fixupPluginRules } = require("@eslint/compat");
const pluginReact = require("eslint-plugin-react");
const pluginReactHooks = require("eslint-plugin-react-hooks");
const pluginWantedly = require("eslint-plugin-wantedly");
const eslintTs = require("typescript-eslint");

const baseConfig = require("./base");

/** @type{import('eslint').Linter.Config[]} */
module.exports = eslintTs.config({
  name: "wantedly/typescript/react",
  files: ["**/*.ts", "**/*.tsx"],
  extends: [...baseConfig, pluginReact.configs.flat.recommended],
  plugins: {
    react: pluginReact,
    "react-hooks": fixupPluginRules(pluginReactHooks),
    wantedly: pluginWantedly,
  },
  rules: {
    // eslint-plugin-react rules
    "react/forbid-prop-types": "off",
    "react/jsx-closing-bracket-location": "warn",
    "react/jsx-filename-extension": ["warn", { extensions: [".jsx", ".tsx"] }],
    "react/jsx-indent-props": ["warn", 2],
    "react/jsx-indent": ["warn", 2],
    "react/jsx-no-bind": ["warn", { allowArrowFunctions: true }],
    "react/jsx-no-duplicate-props": "error",
    "react/jsx-no-target-blank": "warn",
    "react/jsx-uses-react": ["off"],
    "react/jsx-uses-vars": "error",
    "react/jsx-wrap-multilines": "warn",
    "react/no-array-index-key": "error",
    "react/no-did-update-set-state": "error",
    "react/no-find-dom-node": "error",
    "react/no-multi-comp": "off",
    "react/no-string-refs": "error",
    "react/no-unused-prop-types": "off",
    "react/prop-types": "off",
    "react/react-in-jsx-scope": ["off"],
    "react/require-default-props": "off",

    // eslint-plugin-react-hooks rules
    "react-hooks/rules-of-hooks": "error",
    "react-hooks/exhaustive-deps": "warn",

    // eslint-plugin-use-macros rules
    "use-macros/styled-components": "error",

    // eslint-plugin-wantedly rules
    "wantedly/graphql-operation-name": ["warn"],
  },
});
