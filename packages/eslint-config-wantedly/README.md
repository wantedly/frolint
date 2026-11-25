# @wantedly/eslint-config-wantedly

> [!NOTE]
> This package is published to [GitHub Packages](https://github.com/wantedly/frolint/pkgs/npm/eslint-config-wantedly) only (not npm) as `@wantedly/eslint-config-wantedly`.
> Add the following line to `.npmrc` in your project, and authenticate to GitHub Packages with a token that has the `read:packages` scope.
>
> ```
> @wantedly:registry=https://npm.pkg.github.com
> ```

ESLint config for Wantedly. It focuses the JavaScript linting.

## Version Compatibilities

If you're using ESLint v8 and under, please use eslint-config-wantedly version 3.x. As of eslint-config-wantedly version 4.0, it has started exporting ESLint's flat config format.

### Usage (version 4.0 and above)

It exports configurations as "Flat config".

```js
import { base as configWantedly } from "@wantedly/eslint-config-wantedly";

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
