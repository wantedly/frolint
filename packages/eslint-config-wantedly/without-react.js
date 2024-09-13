const _import = require("eslint-plugin-import");
const jsxA11Y = require("eslint-plugin-jsx-a11y");
const eslintPluginJest = require("eslint-plugin-jest");
const useMacros = require("eslint-plugin-use-macros");
const es = require("eslint-plugin-es");
const { fixupPluginRules } = require("@eslint/compat");
const globals = require("globals");
const babelEslintParser = require("@babel/eslint-parser");
const js = require("@eslint/js");
const { FlatCompat } = require("@eslint/eslintrc");

const compat = new FlatCompat({
  baseDirectory: __dirname,
  recommendedConfig: js.configs.recommended,
  allConfig: js.configs.all,
});

/** @type{import('eslint').Linter.Config[]} */
module.exports = [
  ...compat.extends("eslint:recommended", "prettier"),
  {
    name: "wantedly/without-react/plugins",
    plugins: {
      import: fixupPluginRules(_import),
      "jsx-a11y": jsxA11Y,
      jest: eslintPluginJest,
      "use-macros": useMacros,
      es,
    },
  },
  {
    name: "wantedly/without-react/languageOptions",
    languageOptions: {
      globals: {
        ...globals.browser,
        ...eslintPluginJest.environments.globals.globals,
        ...globals.node,
        flushPromises: true,
      },

      parser: babelEslintParser,
      ecmaVersion: 5,
      sourceType: "module",

      parserOptions: {
        ecmaFeatures: {
          experimentalObjectRestSpread: true,
          jsx: true,
        },
        babelOptions: {
          babelrc: false,
          configFile: false,
          // your babel options
          // presets: ["@babel/preset-env"],
        },
      },
    },
  },
  {
    name: "wantedly/without-react/rules",
    rules: {
      "array-callback-return": "off",
      "arrow-body-style": ["off"],
      "arrow-parens": ["warn", "always"],
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

      "new-cap": [
        "error",
        {
          capIsNew: false,
        },
      ],

      "no-alert": "off",
      "no-array-constructor": "error",
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

      "no-plusplus": [
        "error",
        {
          allowForLoopAfterthoughts: true,
        },
      ],

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

      "no-unused-vars": [
        "error",
        {
          varsIgnorePattern: "^_",
          argsIgnorePattern: "^_",
        },
      ],

      "no-use-before-define": "off",
      "no-useless-constructor": "off",
      "no-useless-escape": "off",
      "object-shorthand": "warn",
      "prefer-const": "warn",
      "prefer-template": "warn",
      "quote-props": ["warn", "as-needed"],
      "require-yield": "error",

      "space-before-function-paren": [
        "warn",
        {
          anonymous: "always",
          asyncArrow: "always",
          named: "never",
        },
      ],

      "use-isnan": "error",
      "valid-typeof": "error",

      camelcase: [
        "error",
        {
          ignoreDestructuring: false,
          properties: "never",
        },
      ],

      eqeqeq: ["error", "smart"],
      indent: "off",
      quotes: ["off"],
      semi: ["error", "always"],
      "import/extensions": "off",
      "import/first": "warn",
      "import/no-extraneous-dependencies": ["off"],
      "import/no-unresolved": ["off"],
      "import/prefer-default-export": "off",
      "jsx-a11y/alt-text": "off",
      "jsx-a11y/label-has-for": "off",
      "jsx-a11y/no-noninteractive-element-interactions": "off",
      "jsx-a11y/no-static-element-interactions": "off",
      "use-macros/graphql-tag": "error",
      "es/no-regexp-lookbehind-assertions": "error",
      "es/no-regexp-named-capture-groups": "error",
    },
  },
];
