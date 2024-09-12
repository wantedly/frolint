import { RuleTester } from "eslint";
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
// import ESLintConfigWantedly from "eslint-config-wantedly-typescript";
import { RULE, RULE_NAME } from "../graphql-pascal-case-type-name";

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
      name: "Type name is PascalCase",
      code: `gql\`
  type Foo {
    id: ID!
    foo: String
  }
\`;`,
    },
    {
      name: "Interface type name is PascalCase",
      code: `gql\`
  interface Node {
    id: ID!
  }
\`;`,
    },
    {
      name: "Fragment name is PascalCase",
      code: `gql\`
  fragment FooFragment on Foo {
    id
  }
\`;`,
    },
  ],
  invalid: [
    {
      name: "Interface type name is camelCase",
      code: `gql\`
  interface node {
    id: ID!
  }
\`;`,
      errors: ["The interface type node should be PascalCase"],
    },
    {
      name: "Type name is camelCase",
      code: `gql\`
  type foo implements Node {
    id: ID!
    foo: String
  }
\`;`,
      errors: ["The object type foo should be PascalCase"],
    },
    {
      name: "Fragment name is camelCase",
      code: `gql\`
  fragment fooFragment on Foo {
    id
  }
\`;`,
      errors: ["The fragment fooFragment should be PascalCase"],
    },

    {
      name: "Interface type name is fixed by plugin",
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
      options: ["error", { autofix: true }],
    },
    {
      name: "Type name is fixed by plugin",
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
      options: ["error", { autofix: true }],
    },
    {
      name: "Fragment name is fixed by plugin",
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
      options: ["error", { autofix: true }],
    },
    {
      name: "Nested fragment name is fixed by plugin",
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
      options: ["error", { autofix: true }],
    },
    {
      name: "Nested fragment name is fixed by plugin 2",
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
      options: ["error", { autofix: true }],
    },
  ],
});
