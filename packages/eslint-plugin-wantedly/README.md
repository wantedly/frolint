# @wantedly/eslint-plugin-wantedly

> [!NOTE]
> This package is published to [GitHub Packages](https://github.com/wantedly/frolint/pkgs/npm/eslint-plugin-wantedly) only (not npm) as `@wantedly/eslint-plugin-wantedly`.
> Add the following line to `.npmrc` in your project, and authenticate to GitHub Packages with a token that has the `read:packages` scope.
>
> ```
> @wantedly:registry=https://npm.pkg.github.com
> ```

## Rule details

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
- [`wantedly/nexus-type-description`](./docs/rules/nexus-type-description.md)
  - Validate that the types have descriptions if the code using `nexus`

## Installation

```sh
npm install --save @wantedly/eslint-plugin-wantedly
# or
yarn add @wantedly/eslint-plugin-wantedly
```

## Usage

### With "Flat Config"

```js
import pluginWantedly from "@wantedly/eslint-plugin-wantedly";

export default [
  {
    plugins: {
      wantedly: pluginWantedly,
    },
    rules: {
      "wantedly/graphql-pascal-case-type-name": ["error", { autofix: true }],
    },
  },
];
```

### With "Legacy Config"

```json
{
  "plugins": ["wantedly"],
  "rules": {
    "wantedly/graphql-pascal-case-type-name": ["error", { "autofix": true }]
  }
}
```
