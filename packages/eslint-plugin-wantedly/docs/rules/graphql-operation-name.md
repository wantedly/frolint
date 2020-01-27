# Enfoces consistent naming convention for GraphQL Operation Name in `gql` tag (`wantedly/graphql-operation-name`)

## Rule Details

#### Valid

```js
gql`
  query GetUser {
    id
  }
`;
```

#### Invalid

```js
gql`
  query getUser {
    id
  }
`;
```

This rule is automatically fix some problems reported by this rule.
