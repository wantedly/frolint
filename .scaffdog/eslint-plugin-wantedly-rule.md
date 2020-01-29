---
name: "eslint-plugin-wantedly-rule"
description: "Template to create rule of eslint-plugin-wantedly"
message: "Please enter rule name."
root: "packages/eslint-plugin-wantedly"
output: "**/*"
ignore: []
---

# `rules/{{ input }}.js`

```javascript
const { Linter } = require("eslint");
const { getOptionWithDefault, docsUrl } = require("./utils");

const linter = new Linter();
const RULE_NAME = "{{ input }}";

// Represents the default option and schema for nexus-upper-case-enum-members option
const DEFAULT_OPTION = {
  autofix: false,
};

linter.defineRule(RULE_NAME, {
  meta: {
    type: "suggestion",
    fixable: "code",
    docs: {
      url: docsUrl(RULE_NAME),
    },
  },
  create(context) {
    // Code fun !!
    return {};
  },
});

module.exports = {
  RULE_NAME,
  RULE: linter.getRules().get(RULE_NAME),
};
```

# `rules/__tests__/{{ input }}.test.js`

```javascript
const RuleTester = require("eslint").RuleTester;
const ESLintConfigWantedly = require("eslint-config-wantedly/without-react");
const rule = require("../{{ input }}");

RuleTester.setDefaultConfig({
  parser: require.resolve(ESLintConfigWantedly.parser),
  parserOptions: ESLintConfigWantedly.parserOptions,
});

const ruleTester = new RuleTester();
ruleTester.run(rule.RULE_NAME, rule.RULE, {
  valid: [],
  invalid: [],
});
```

# `docs/rules/{{ input }}.md`

```markdown
# Short description here (`wantedly/{{ input }}`)

## Rule Details

#### Valid

#### Invalid
```
