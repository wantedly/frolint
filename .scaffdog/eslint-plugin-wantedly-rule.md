---
name: "eslint-plugin-wantedly-rule"
description: "Template to create rule of eslint-plugin-wantedly"
message: "Please enter rule name with kebab-case."
root: "packages/eslint-plugin-wantedly"
output: "."
ignore: ["**/*"]
---

# `src/rules/{{ input }}.ts`

```ts
import type { Rule } from "eslint";
import { Linter } from "eslint";
import { docsUrl, getOptionWithDefault } from "./utils";

const linter = new Linter();
export const RULE_NAME = "{{ input }}";

// Represents the default option and schema for {{ input }} option
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
    return {
      // TODO: Write the implementation for this rule.
    };
  },
});

export const RULE = linter.getRules().get(RULE_NAME) as Rule.RuleModule;
```

# `rules/__tests__/{{ input }}.test.js`

```javascript
import { RuleTester } from "eslint";
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import ESLintConfigWantedly from "eslint-config-wantedly/without-react";
import { RULE, RULE_NAME } from "../{{ input }}";

new RuleTester({
  parser: require.resolve(ESLintConfigWantedly.parser),
  parserOptions: ESLintConfigWantedly.parserOptions,
}).run(RULE_NAME, RULE, {
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
