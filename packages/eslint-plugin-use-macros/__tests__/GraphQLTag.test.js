const RuleTester = require("eslint").RuleTester;

const GraphQLTagRule = require("../rules/GraphQLTag");

const ruleTester = new RuleTester({
  languageOptions: {
    ecmaVersion: "latest",
  },
});
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
