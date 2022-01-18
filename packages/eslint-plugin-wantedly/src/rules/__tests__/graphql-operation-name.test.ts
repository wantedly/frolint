import { RuleTester } from "eslint";
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import ESLintConfigWantedly from "eslint-config-wantedly-typescript";
import { RULE, RULE_NAME } from "../graphql-operation-name";

const ruleTester = new RuleTester({
  parser: require.resolve(ESLintConfigWantedly.parser),
  parserOptions: ESLintConfigWantedly.parserOptions,
});
ruleTester.run(RULE_NAME, RULE, {
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
