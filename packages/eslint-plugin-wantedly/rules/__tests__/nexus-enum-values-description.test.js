const RuleTester = require("eslint").RuleTester;
const ESLintConfigWantedly = require("eslint-config-wantedly/without-react");
const rule = require("../nexus-enum-values-description");

RuleTester.setDefaultConfig({
  parser: require.resolve(ESLintConfigWantedly.parser),
  parserOptions: ESLintConfigWantedly.parserOptions,
});

const ruleTester = new RuleTester();
ruleTester.run(rule.RULE_NAME, rule.RULE, {
  valid: [],
  invalid: [
    {
      code: `import { enumType } from "nexus";
export const CountryCode = enumType({
  name: "CountryCode",
  members: [
    { name: "JP", description: "This represents Japan" },
    { name: "US" },
    "CN",
    { name: "FR", description: "" },
    { name: "ES", description: "                     " },
  ],
});`,
      errors: [
        "The enum member `CountryCode.US` should have a description",
        "The enum member `CountryCode.CN` should have a description",
        "The enum member `CountryCode.FR` should have a description",
        "The enum member `CountryCode.ES` should have a description",
      ],
    },
    {
      code: `import { enumType } from "nexus";
export const CountryCode = enumType({
  name: "CountryCode",
  members: {
    JP: 1,
    US: 2,
  },
});`,
      errors: [
        "The enum definition `CountryCode` cannot specify the description for each enum member. You should use array expression for members property instead",
      ],
    },

    {
      code: `import { enumType } from "nexus";
const members = [
  { name: "JP", description: "This represents Japan" },
  { name: "US" },
  "CN",
  { name: "FR", description: "" },
  { name: "ES", description: "                     " },
];
export const CountryCode = enumType({
  name: "CountryCode",
  members,
});`,
      errors: [
        "The enum member `CountryCode.US` should have a description",
        "The enum member `CountryCode.CN` should have a description",
        "The enum member `CountryCode.FR` should have a description",
        "The enum member `CountryCode.ES` should have a description",
      ],
    },
    {
      code: `import { enumType } from "nexus";
const members = { JP: 1, US: 2 };
export const CountryCode = enumType({
  name: "CountryCode",
  members,
});`,
      errors: [
        "The enum definition `CountryCode` cannot specify the description for each enum member. You should use array expression for members property instead",
      ],
    },
  ],
});
