# eslint-plugin-wantedly [![npm version](https://badge.fury.io/js/eslint-plugin-wantedly.svg)](https://badge.fury.io/js/eslint-plugin-wantedly)

## Installation

```sh
npm install --save eslint-plugin-wantedly
# or
yarn add eslint-plugin-wantedly
```

This plugin provides the opinionated rules in Wantedly.

## List of supported rules

- [`wantedly/graphql-operation-name`](./docs/rules/graphql-operation-name.md)
  - Enfoces consistent naming convention for GraphQL Operation Name in `gql` tag
- [`wantedly/graphql-pascal-case-type-name`](./docs/rules/graphql-pascal-case-type-name.md)
  - Check the type name which is PascalCase in `gql` tag
- [`wantedly/nexus-camel-case-field-name`](./docs/rules/nexus-camel-case-field-name.md)
  - Check the field name which is camelCase if the code using `nexus`
- [`wantedly/nexus-pascal-case-type-name`](./docs/rules/nexus-pascal-case-type-name.md)
  - Check the type name which is PascalCase if the code using `nexus`
- [`wantedly/nexus-upper-case-enum-members`](./docs/rules/nexus-upper-case-enum-members.md)
  - Check the enum members are UPPER_CASE if the code using `nexus`
