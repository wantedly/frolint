module.exports = {
  env: {
    browser: true,
    es6: true,
    "jest/globals": true,
    node: true,
  },
  globals: {
    flushPromises: true,
  },
  extends: ["plugin:@typescript-eslint/recommended", "prettier", "prettier/@typescript-eslint"],
  parser: "@typescript-eslint/parser",
  parserOptions: {
    ecmaFeatures: {
      experimentalObjectRestSpread: true,
      jsx: true,
    },
    sourceType: "module",
  },
  plugins: ["import", "jsx-a11y", "jest", "prettier", "@typescript-eslint", "use-macros"],
  rules: {
    "array-callback-return": "off",
    "arrow-body-style": ["off"],
    "arrow-parens": ["warn", "as-needed"],
    "class-methods-use-this": "off",
    "comma-dangle": [
      "error",
      {
        arrays: "always-multiline",
        objects: "always-multiline",
        imports: "always-multiline",
        exports: "always-multiline",
        functions: "never",
      },
    ],
    "consistent-return": "off",
    "constructor-super": "error",
    "dot-notation": "warn",
    "for-direction": "error",
    "generator-star-spacing": ["off"],
    "getter-return": "error",
    "jsx-no-target-blank": "off",
    "jsx-quotes": ["off"],
    "linebreak-style": ["error", "unix"],
    "max-len": ["off"],
    "new-cap": ["error", { capIsNew: false }],
    "no-alert": "off",
    "no-array-constructor": "off",
    "no-case-declarations": "error",
    "no-class-assign": "error",
    "no-compare-neg-zero": "error",
    "no-cond-assign": "warn",
    "no-console": "error",
    "no-const-assign": "error",
    "no-constant-condition": "error",
    "no-control-regex": "error",
    "no-debugger": "error",
    "no-delete-var": "error",
    "no-dupe-args": "error",
    "no-dupe-class-members": "error",
    "no-dupe-keys": "error",
    "no-duplicate-case": "error",
    "no-else-return": "warn",
    "no-empty-character-class": "error",
    "no-empty-pattern": "error",
    "no-empty": "error",
    "no-ex-assign": "error",
    "no-extra-boolean-cast": "warn",
    "no-fallthrough": "error",
    "no-func-assign": "error",
    "no-global-assign": "error",
    "no-inner-declarations": "error",
    "no-invalid-regexp": "error",
    "no-irregular-whitespace": "error",
    "no-lonely-if": "warn",
    "no-mixed-operators": [
      "warn",
      {
        groups: [
          ["&", "|", "^", "~", "<<", ">>", ">>>"],
          ["&&", "||"],
        ],
        allowSamePrecedence: true,
      },
    ],
    "no-nested-ternary": "off",
    "no-new-symbol": "error",
    "no-obj-calls": "error",
    "no-octal": "error",
    "no-param-reassign": "error",
    "no-plusplus": ["error", { allowForLoopAfterthoughts: true }],
    "no-redeclare": "error",
    "no-regex-spaces": "error",
    "no-self-assign": "error",
    "no-shadow": "off",
    "no-sparse-arrays": "error",
    "no-this-before-super": "error",
    "no-undef": "error",
    "no-underscore-dangle": ["off"],
    "no-unreachable": "error",
    "no-unsafe-finally": "error",
    "no-unsafe-negation": "error",
    "no-unused-labels": "error",
    "no-unused-vars": "off",
    "no-use-before-define": "off",
    "no-useless-constructor": "off",
    "no-useless-escape": "off",
    "object-shorthand": "warn",
    "prefer-const": "warn",
    "prefer-template": "warn",
    "quote-props": ["warn", "as-needed"],
    "require-yield": "error",
    "space-before-function-paren": ["warn", { anonymous: "never", asyncArrow: "always", named: "never" }],
    "use-isnan": "error",
    "valid-typeof": "error",
    camelcase: "off",
    eqeqeq: "error",
    indent: "off",
    quotes: ["off"],
    semi: "off",

    // @typescript-eslint/eslint-plugin rules
    "@typescript-eslint/camelcase": ["error", { ignoreDestructuring: true, properties: "never" }],
    "@typescript-eslint/explicit-function-return-type": ["off"],
    "@typescript-eslint/explicit-member-accessibility": [
      "error",
      { overrides: { constructors: "no-public", parameterProperties: "no-public", accessors: "no-public" } },
    ],
    "@typescript-eslint/func-call-spacing": ["error", "never"],
    "@typescript-eslint/indent": "off",
    "@typescript-eslint/no-array-constructor": "error",
    "@typescript-eslint/no-explicit-any": ["off"],
    "@typescript-eslint/no-floating-promises": ["error"],
    "@typescript-eslint/no-unused-vars": [
      "error",
      { varsIgnorePattern: "^_", argsIgnorePattern: "^_", ignoreRestSiblings: true },
    ],
    "@typescript-eslint/no-use-before-define": "off",
    "@typescript-eslint/no-useless-constructor": "off",
    "@typescript-eslint/semi": ["error", "always"],

    // eslint-plugin-import rules
    "import/extensions": "off",
    "import/first": "warn",
    "import/no-extraneous-dependencies": ["off"],
    "import/no-unresolved": ["off"],
    "import/prefer-default-export": "off",

    // eslint-plugin-jsx-a11y rules
    "jsx-a11y/alt-text": "off",
    "jsx-a11y/label-has-for": "off",
    "jsx-a11y/no-noninteractive-element-interactions": "off",
    "jsx-a11y/no-static-element-interactions": "off",

    // eslint-plugin-use-macros rules
    "use-macros/graphql-tag": "error",
  },
};
