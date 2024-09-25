# eslint-config-wantedly [![npm version](https://badge.fury.io/js/eslint-config-wantedly.svg)](https://badge.fury.io/js/eslint-config-wantedly)

ESLint config for Wantedly. It focuses the JavaScript linting.

## Version Compatibilities

If you're using ESLint v8 and under, please use eslint-config-wantedly version 3.x. As of eslint-config-wantedly version 4.0, it has started exporting ESLint's flat config format.

### Usage (version 4.0 and above)

It exports configurations as "Flat config".

```js
import { base as configWantedly } from "eslint-config-wantedly";

export default [
  ...configWantedly,
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
  "extends": ["wantedly"],
  "rules": {
    // Your rules go here.
  }
}
```

## Configuration details

### Parser

Using `@babel/eslint-parser`

### Extends

- eslint:recommended
- [plugin:react/recommended](https://github.com/yannickcr/eslint-plugin-react#recommended)

### Plugins

- [react](https://github.com/yannickcr/eslint-plugin-react)
- [import](https://github.com/benmosher/eslint-plugin-import)
- [jsx-a11y](https://github.com/evcohen/eslint-plugin-jsx-a11y)
- [jest](https://github.com/jest-community/eslint-plugin-jest)

### Rules

See [index.js](https://github.com/wantedly/frolint/blob/master/packages/eslint-config-wantedly/index.js#L21-L117)
