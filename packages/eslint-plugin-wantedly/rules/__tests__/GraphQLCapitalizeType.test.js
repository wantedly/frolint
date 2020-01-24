const RuleTester = require("eslint").RuleTester;
const ESLintConfigWantedly = require("eslint-config-wantedly/without-react");
const GraphQLCapitalizeType = require("../GraphQLCapitalizeType");

RuleTester.setDefaultConfig({
  parser: require.resolve(ESLintConfigWantedly.parser),
  parserOptions: ESLintConfigWantedly.parserOptions,
});

const ruleTester = new RuleTester();
ruleTester.run(GraphQLCapitalizeType.RULE_NAME, GraphQLCapitalizeType.RULE, {
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
