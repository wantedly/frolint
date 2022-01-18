import { RuleTester } from "eslint";
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import ESLintConfigWantedly from "eslint-config-wantedly-typescript";
import { RULE, RULE_NAME } from "../nexus-enum-values-description";

const ruleTester = new RuleTester({
  parser: require.resolve(ESLintConfigWantedly.parser),
  parserOptions: ESLintConfigWantedly.parserOptions,
});
ruleTester.run(RULE_NAME, RULE, {
  valid: [],
  invalid: [
    {
      code: `import { enumType } from "@nexus/schema";
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
      code: `import { enumType } from "@nexus/schema";
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
      code: `import { enumType } from "@nexus/schema";
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
      code: `import { enumType } from "@nexus/schema";
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
