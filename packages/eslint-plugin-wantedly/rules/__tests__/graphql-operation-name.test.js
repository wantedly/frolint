const RuleTester = require("eslint").RuleTester;
const ESLintConfigWantedly = require("eslint-config-wantedly/without-react");
const rule = require("../graphql-operation-name");

RuleTester.setDefaultConfig({
  parser: require.resolve(ESLintConfigWantedly.parser),
  parserOptions: ESLintConfigWantedly.parserOptions,
});

const ruleTester = new RuleTester();
ruleTester.run(rule.RULE_NAME, rule.RULE, {
  valid: [
    {
      code: `
gql\`
  query GetProject {
    id
  }
\`;
`,
    },
    {
      code: `
gql\`
  query GetProject {
    ...ProjectFragment
  }
  \$\{projectFragment\}
\`;
`,
    },
  ],
  invalid: [
    {
      code: `
gql\`
  query getProject {
    id
  }
\`;
`,
      errors: ["The operation name getProject should be PascalCase"],
    },
    {
      code: `gql\`
  query getProject {
    id
  }
\`;`,
      output: `gql\`
  query GetProject {
    id
  }
\`;`,
      errors: ["The operation name getProject should be PascalCase"],
      options: [{ autofix: true }],
    },
    {
      code: `
gql\`
  query {
    id
  }
\`;
`,
      errors: ["Specify the operation name for query"],
    },
    {
      code: `
gql\`
  mutation {
    id
  }
\`;
`,
      errors: ["Specify the operation name for mutation"],
    },
    {
      code: `
gql\`
  query GetProject {
    ...ProjectFragment
    \$\{projectFragment\}
  }
\`;
`,
      errors: ["Interpolation must occur outside of the brackets"],
    },
  ],
});
