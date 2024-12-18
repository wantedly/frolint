const babelEslintParser = require("@babel/eslint-parser");
const js = require("@eslint/js");
const configPrettier = require("eslint-config-prettier");
const pluginESx = require("eslint-plugin-es-x");
const pluginImport = require("eslint-plugin-import");
const pluginJest = require("eslint-plugin-jest");
const pluginJsxA11Y = require("eslint-plugin-jsx-a11y");
const pluginUseMacros = require("eslint-plugin-use-macros");
const globals = require("globals");

/** @type{import('eslint').Linter.Config[]} */
module.exports = [
  js.configs.recommended,
  configPrettier,
  {
    name: "wantedly/base",
    plugins: {
      import: pluginImport,
      "jsx-a11y": pluginJsxA11Y,
      jest: pluginJest,
      "use-macros": pluginUseMacros,
      "es-x": pluginESx,
    },
    languageOptions: {
      globals: {
        ...globals.browser,
        ...pluginJest.environments.globals.globals,
        ...globals.node,
        flushPromises: true,
      },

      parser: babelEslintParser,
      ecmaVersion: "latest",
      sourceType: "module",

      parserOptions: {
        requireConfigFile: false,
        ecmaVersion: "latest",
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
          args: "all",
          argsIgnorePattern: "^_",
          caughtErrors: "all",
          caughtErrorsIgnorePattern: "^_",
          destructuredArrayIgnorePattern: "^_",
          varsIgnorePattern: "^_",
          ignoreRestSiblings: true,
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
      "import/prefer-default-export": "off",
      "jsx-a11y/alt-text": "off",
      "jsx-a11y/label-has-for": "off",
      "jsx-a11y/no-noninteractive-element-interactions": "off",
      "jsx-a11y/no-static-element-interactions": "off",
      "use-macros/graphql-tag": "error",
      "es-x/no-regexp-lookbehind-assertions": "error",
      "es-x/no-regexp-named-capture-groups": "error",
    },
  },
];
