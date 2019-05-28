const RuleTester = require("eslint").RuleTester;
const ESLintConfigWantedly = require("eslint-config-wantedly/without-react");
const GraphQLTagRule = require("../rules/GraphQLTag");

RuleTester.setDefaultConfig({
  parser: ESLintConfigWantedly.parser,
  parserOptions: ESLintConfigWantedly.parserOptions,
});

const ruleTester = new RuleTester();
ruleTester.run("use-macros/graphql-tag", GraphQLTagRule, {
  valid: [
    {
      code: `import gql from "graphql-tag.macro";`,
    },
  ],
  invalid: [
    {
      code: `import styled from "graphql-tag";`,
      output: `import styled from "graphql-tag.macro";`,
      errors: ['Please import from "graphql-tag.macro" instead of "graphql-tag"'],
    },
  ],
});
