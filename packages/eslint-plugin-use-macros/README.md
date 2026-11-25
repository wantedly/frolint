# @wantedly/eslint-plugin-use-macros

> [!NOTE]
> This package is published to [GitHub Packages](https://github.com/wantedly/frolint/pkgs/npm/eslint-plugin-use-macros) only (not npm) as `@wantedly/eslint-plugin-use-macros`.
> Add the following line to `.npmrc` in your project, and authenticate to GitHub Packages with a token that has the `read:packages` scope.
>
> ```
> @wantedly:registry=https://npm.pkg.github.com
> ```

## Rule details

This plugin provides the rules to use the babel macros for specific libraries (such as styled-components and graphql-tag.)

- styled-components -> styled-components/macro
  - use-macros/styled-components
- graphql-tag -> graphql.macro
  - use-macros/graphql-tag

```ts
// invalid
import gql from "graphql-tag";

const QUERY = gql`
  query getUser {
    user {
      id
      title
    }
  }
`;
```

👇

```ts
// valid
import { gql } from "graphql.macro";

const QUERY = gql`
  query getUser {
    user {
      id
      title
    }
  }
`;
```

## Installation

```sh
npm install --save @wantedly/eslint-plugin-use-macros
# or
yarn add @wantedly/eslint-plugin-use-macros
```

## Usage

### With "Flat Config"

```js
import pluginUseMacros from "@wantedly/eslint-plugin-use-macros";

export default [
  {
    plugins: {
      "use-macros": pluginUseMacros,
    },
    rules: {
      "use-macros/styled-components": "error",
    },
  },
];
```

### With "Legacy Config"

```json
{
  "plugins": ["use-macros"],
  "rules": {
    "use-macros/styled-components": "error"
  }
}
```
