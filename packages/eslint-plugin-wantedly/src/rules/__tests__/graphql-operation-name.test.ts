import { RuleTester } from "eslint";
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
// import ESLintConfigWantedly from "eslint-config-wantedly-typescript";
import { RULE, RULE_NAME } from "../graphql-operation-name";

const ruleTester = new RuleTester({
  languageOptions: {
    ecmaVersion: "latest",
    // parser: require.resolve(ESLintConfigWantedly.parser),
    // parserOptions: ESLintConfigWantedly.parserOptions,
  },
});
ruleTester.run(RULE_NAME, RULE, {
  valid: [
    {
      name: "Operation name is Pascal case",
      code: `
gql\`
  query GetProject {
    id
  }
\`;
`,
    },
    {
      name: "With fragment",
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
      name: "Operation name is camelCase",
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
      name: "autofix option is enabled",
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
      options: ["error", { autofix: true }],
    },
    {
      name: "No operation name is specified for a query",
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
      name: "No operation name is specified for a mutation",
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
      name: "Fragment definition is not appropriate",
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
