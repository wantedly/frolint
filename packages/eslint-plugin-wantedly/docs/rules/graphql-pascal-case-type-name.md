# Check the type name which is PascalCase in `gql` tag (`wantedly/graphql-pascal-case-type-name`)

## Rule Details

#### Valid

```js
gql`
  fragment FooFragment on Foo {
    id
  }
`;
```

#### Invalid

```js
gql`
  fragment fooFragment on Foo {
    id
  }
`;
```

This rule is automatically fix some problems reported by this rule.
