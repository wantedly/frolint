import { RuleTester } from "eslint";
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import ESLintConfigWantedly from "eslint-config-wantedly/without-react";
import { RULE, RULE_NAME } from "../no-data-testid";

new RuleTester({
  parser: require.resolve(ESLintConfigWantedly.parser),
  parserOptions: ESLintConfigWantedly.parserOptions,
}).run(RULE_NAME, RULE, {
  valid: [
    {
      code: `<div />`,
    },
  ],
  invalid: [
    {
      code: `<div data-testid="foo" />`,
      errors: ["Attribute data-testid is not allowed."],
    },
    {
      code: `<div data-test-id="foo" />`,
      errors: ["Attribute data-test-id is not allowed."],
      options: [{ denyKeyList: ["data-test-id"] }],
    },
    {
      code: `<div data-testid1="foo" data-testid2="bar" />`,
      errors: ["Attribute data-testid1 is not allowed.", "Attribute data-testid2 is not allowed."],
      options: [{ denyKeyList: ["data-testid1", "data-testid2"] }],
    },
  ],
});
