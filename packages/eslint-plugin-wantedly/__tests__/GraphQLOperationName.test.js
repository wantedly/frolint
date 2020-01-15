const RuleTester = require("eslint").RuleTester;
const ESLintConfigWantedly = require("eslint-config-wantedly/without-react");
const GraphQLOperationName = require("../rules/GraphQLOperationName");

RuleTester.setDefaultConfig({
  parser: require.resolve(ESLintConfigWantedly.parser),
  parserOptions: ESLintConfigWantedly.parserOptions,
});

const ruleTester = new RuleTester();
ruleTester.run("wantedly/graphql-operation-name", GraphQLOperationName, {
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
      errors: ["Use PascalCase for operation name: getProject -> GetProject"],
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
