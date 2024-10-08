# eslint-config-wantedly-typescript [![npm version](https://badge.fury.io/js/eslint-config-wantedly-typescript.svg)](https://badge.fury.io/js/eslint-config-wantedly-typescript)

ESLint config for Wantedly. It focuses the TypeScript linting.

## Version Compatibilities

If you're using ESLint v8 and under, please use eslint-config-wantedly-typescript version 3.x. As of eslint-config-wantedly-typescript version 4.0, it has started exporting ESLint's flat config format.

### Usage (version 4.0 and above)

It exports configurations as "Flat config".

```js
import { base as configWantedlyTS } from "eslint-config-wantedly-typescript";

export default [
  ...configWantedlyTS,
  {
    rules: {
      // Your rules go here.
    }
  }
];
```

### Usage (version 3.x and under)

It exports configurations as "Legacy" format.

```json
{
  "extends": ["wantedly-typescript"],
  "rules": {
    // Your rules go here.
  }
}
```

## Configuration details

### Parser

Using `@typescript-eslint/parser`

### Extends

- [plugin:@typescript-eslint/recommended](https://github.com/typescript-eslint/typescript-eslint/tree/master/packages/eslint-plugin)
- [plugin:react/recommended](https://github.com/yannickcr/eslint-plugin-react#recommended)
- [prettier](https://github.com/prettier/eslint-plugin-prettier#recommended-configuration)
- [prettier/@typescript-eslint](https://github.com/prettier/eslint-config-prettier/blob/master/%40typescript-eslint.js)

### Plugins

- [react](https://github.com/yannickcr/eslint-plugin-react)
- [import](https://github.com/benmosher/eslint-plugin-import)
- [jsx-a11y](https://github.com/evcohen/eslint-plugin-jsx-a11y)
- [jest](https://github.com/jest-community/eslint-plugin-jest)
- [prettier](https://github.com/prettier/eslint-plugin-prettier)
- [@typescript-eslint](https://github.com/typescript-eslint/typescript-eslint/tree/master/packages/eslint-plugin)

### Rules

See [index.js](https://github.com/wantedly/frolint/blob/master/packages/eslint-config-wantedly-typescript/index.js#L26-L162)
