const { env, globals, extends: extendOptions, parser, parserOptions, plugins, rules } = require("./without-react");

module.exports = {
  env,
  globals,
  extends: [...extendOptions, "plugin:react/recommended"],
  parser,
  parserOptions,
  plugins: [...plugins, "react"],
  rules: {
    ...rules,

    // eslint-plugin-react rules
    "react/forbid-prop-types": "off",
    "react/jsx-closing-bracket-location": "warn",
    "react/jsx-filename-extension": ["warn", { extensions: [".jsx", ".tsx"] }],
    "react/jsx-indent-props": ["warn", 2],
    "react/jsx-indent": ["warn", 2],
    "react/jsx-no-bind": ["warn", { allowArrowFunctions: true }],
    "react/jsx-no-duplicate-props": "error",
    "react/jsx-no-target-blank": "warn",
    "react/jsx-uses-vars": "error",
    "react/jsx-wrap-multilines": "warn",
    "react/no-array-index-key": "error",
    "react/no-did-update-set-state": "error",
    "react/no-find-dom-node": "error",
    "react/no-multi-comp": "off",
    "react/no-string-refs": "error",
    "react/no-unused-prop-types": "off",
    "react/prop-types": "off",
    "react/require-default-props": "off",
  },
};
