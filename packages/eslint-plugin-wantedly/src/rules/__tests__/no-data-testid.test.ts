import { TSESLint } from "@typescript-eslint/experimental-utils";
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import ESLintConfigWantedly from "eslint-config-wantedly/without-react";
import { RULE, RULE_NAME } from "../no-data-testid";

// new RuleTester({
new TSESLint.RuleTester({
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
      errors: [
        {
          messageId: "noDataTestId",
          data: {
            key: "data-testid"
          }
        }
      ],
    },
    {
      code: `<div data-test-id="foo" />`,
      errors: [
        {
          messageId: "noDataTestId",
          data: {
            key: "data-test-id"
          }
        }
      ],
      options: [{ denyKeyList: ["data-test-id"] }],
    },
    {
      code: `<div data-testid1="foo" data-testid2="bar" />`,
      errors: [
        {
          messageId: "noDataTestId",
          data: {
            key: "data-testid1"
          }
        },
        {
          messageId: "noDataTestId",
          data: {
            key: "data-testid2"
          }
        }
      ],
      options: [{ denyKeyList: ["data-testid1", "data-testid2"] }],
    },
    {
      code: `
        <div>
          <div data-testid="foo">
          </div>
          <div data-testid="bar">
          </div>
        </div>
      `,
      errors: [
        {
          messageId: "noDataTestId",
          data: {
            key: "data-testid"
          }
        },
        {
          messageId: "noDataTestId",
          data: {
            key: "data-testid"
          }
        }
      ],
    },
  ],
});
