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

This rule is automatically fix some problems reported by this rule if the `autofix` option is true.

## Options

#### `autofix`

The `autofix` option is enabling the auto fix function.

```json
{
  "rule": {
    "wantedly/graphql-pascal-case-type-name": ["error", { "autofix": true }]
  }
}
```

```js
/* eslint wantedly/graphql-pascal-case-type-name: ["error", { "autofix": true }] */
```
