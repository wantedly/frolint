# eslint-plugin-use-macros [![npm version](https://badge.fury.io/js/eslint-plugin-use-macros.svg)](https://badge.fury.io/js/eslint-plugin-use-macros)

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
npm install --save eslint-plugin-use-macros
# or
yarn add eslint-plugin-use-macros
```

## Usage

### With "Flat Config"

```js
import pluginUseMacros from "eslint-plugin-use-macros";

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
