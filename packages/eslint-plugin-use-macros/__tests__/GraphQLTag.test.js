const RuleTester = require("eslint").RuleTester;
const ESLintConfigWantedly = require("eslint-config-wantedly-typescript");
const GraphQLTagRule = require("../rules/GraphQLTag");

RuleTester.setDefaultConfig({
  parser: require.resolve(ESLintConfigWantedly.parser),
  parserOptions: ESLintConfigWantedly.parserOptions,
});

const ruleTester = new RuleTester();
ruleTester.run("use-macros/graphql-tag", GraphQLTagRule, {
  valid: [
    {
      code: `import { gql } from "graphql.macro";`,
    },
  ],
  invalid: [
    {
      code: `import gql from "graphql-tag";`,
      output: `import { gql } from "graphql.macro";`,
      errors: ['Please import from "graphql.macro" instead of "graphql-tag"'],
    },
  ],
});
