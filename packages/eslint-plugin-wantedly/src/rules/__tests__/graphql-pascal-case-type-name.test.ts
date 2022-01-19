import { RuleTester } from "eslint";
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import ESLintConfigWantedly from "eslint-config-wantedly-typescript";
import { RULE, RULE_NAME } from "../graphql-pascal-case-type-name";

const ruleTester = new RuleTester({
  parser: require.resolve(ESLintConfigWantedly.parser),
  parserOptions: ESLintConfigWantedly.parserOptions,
});
ruleTester.run(RULE_NAME, RULE, {
  valid: [
    {
      code: `gql\`
  type Foo {
    id: ID!
    foo: String
  }
\`;`,
    },
    {
      code: `gql\`
  interface Node {
    id: ID!
  }
\`;`,
    },
    {
      code: `gql\`
  fragment FooFragment on Foo {
    id
  }
\`;`,
    },
  ],
  invalid: [
    {
      code: `gql\`
  interface node {
    id: ID!
  }
\`;`,
      errors: ["The interface type node should be PascalCase"],
    },
    {
      code: `gql\`
  type foo implements Node {
    id: ID!
    foo: String
  }
\`;`,
      errors: ["The object type foo should be PascalCase"],
    },
    {
      code: `gql\`
  fragment fooFragment on Foo {
    id
  }
\`;`,
      errors: ["The fragment fooFragment should be PascalCase"],
    },

    {
      code: `gql\`
  interface node {
    id: ID!
  }
\`;`,
      output: `gql\`
  interface Node {
    id: ID!
  }
\`;`,
      errors: ["The interface type node should be PascalCase"],
      options: [{ autofix: true }],
    },
    {
      code: `gql\`
  type foo implements Node {
    id: ID!
    foo: String
  }
\`;`,
      output: `gql\`
  type Foo implements Node {
    id: ID!
    foo: String
  }
\`;`,
      errors: ["The object type foo should be PascalCase"],
      options: [{ autofix: true }],
    },
    {
      code: `gql\`
  fragment fooFragment on Foo {
    id
  }
\`;`,
      output: `gql\`
  fragment FooFragment on Foo {
    id
  }
\`;`,
      errors: ["The fragment fooFragment should be PascalCase"],
      options: [{ autofix: true }],
    },
    {
      code: `gql\`
  fragment fooFragment on Foo {
    id
  }
  \$\{BarFragment\}
\`;`,
      output: `gql\`
  fragment FooFragment on Foo {
    id
  }
  \$\{BarFragment\}
\`;`,
      errors: ["The fragment fooFragment should be PascalCase"],
      options: [{ autofix: true }],
    },
    {
      code: `gql\`
  \$\{BarFragment\}
  fragment fooFragment on Foo {
    id
  }
\`;`,
      output: `gql\`
  \$\{BarFragment\}
  fragment FooFragment on Foo {
    id
  }
\`;`,
      errors: ["The fragment fooFragment should be PascalCase"],
      options: [{ autofix: true }],
    },
  ],
});
