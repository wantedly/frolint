# frolint [![npm version](https://badge.fury.io/js/frolint.svg)](https://badge.fury.io/js/frolint)

## Installation

```sh
npm install --save frolint
# or
yarn add frolint
```

## Usage

You can use this package only installing as dependency. If you want to configure the ESLint configuration, you should locate the `.eslintrc` for your root directory and you specify the file in config file.

```sh-session
$ yarn add -D frolint
# or
$ npm install -D frolint
```

And then you intend to commit some files including JS / TS files, the `frolint` reports if the code has some ESLint errors and warnings. If the code has **ESLint errors**, the commit is canceled. If your changes include only **ESLint warnings**, the commit is allowed but you should resolve the warnings we think.

```sh-session
$ git commit
Detected 2 errors, 0 warnings
./foo.js: 2 errors, 0 warnings found.
  ./foo.js:1:7 'foo' is assigned a value but never used. Allowed unused vars must match /^_/. (no-unused-vars)
  ./foo.js:1:13 'bar' is defined but never used. Allowed unused args must match /^_/. (no-unused-vars)
commit canceled with exit status 1. You have to fix ESLint errors.
```

### `frolint` as CLI

If you want to check all fiels in the repository, you can use the `frolint` as CLI.

```sh-session
$ yarn frolint
No errors and warnings!
✨  Done in 2.36s.
```

## Configuration

You can configure the `frolint` behaviour. `frolint` uses [cosmiconfig](https://github.com/davidtheclark/cosmiconfig) for configuration file support. We have not tested except the `package.json` but you can configure via below files.

- `package.json`
- `.frolintrc`
- `.frolintrc.json`
- `.frolintrc.yaml`
- `.frolintrc.yml`
- `.frolintrc.js`
- `frolint.config.js`

### `typescript` property

You can specify the typescript property as boolean (default is `true`). This means that `frolint` parses the JS / TS files using [`@typescript-eslint/parser`](https://github.com/typescript-eslint/typescript-eslint/tree/master/packages/parser). It is configured in [`eslint-config-wantedly-typescript`](https://github.com/wantedly/frolint/tree/master/packages/eslint-config-wantedly-typescript). If you specify this as `false`, `frolint` uses the parser as [`babel-eslint`](https://github.com/babel/babel-eslint) (This is configured in [`eslint-config-wantedly`](https://github.com/wantedly/frolint/tree/master/packages/eslint-config-wantedly)).

```json
{
  "frolint": {
    "typescript": false
  }
}
```

### `formatter` property

You can specify the ESLint formatter as string (default is `undefined`). If you don't specify the formatter, `frolint` reports the ESLint issues using original formatter. If you want to using ESLint formatter (e.g. checkstyle), you can specify the `formatter` property.

```json
{
  "frolint": {
    "formatter": "checkstyle"
  }
}
```

```sh-session
# Default original formatter
$ git commit
Detected 2 errors, 0 warnings
./foo.js: 2 errors, 0 warnings found.
  ./foo.js:1:7 'foo' is assigned a value but never used. Allowed unused vars must match /^_/. (no-unused-vars)
  ./foo.js:1:13 'bar' is defined but never used. Allowed unused args must match /^_/. (no-unused-vars)
commit canceled with exit status 1. You have to fix ESLint errors.

# "formatter": "checkstyle"
$ git commit
<?xml version="1.0" encoding="utf-8"?><checkstyle version="4.3"><file name="/Users/yamadayuki/dev/src/github.com/wantedly/frolint/foo.js"><error line="1" column="7" severity="error" message="&apos;foo&apos; is assigned a value but never used. Allowed unused vars must match /^_/. (no-unused-vars)" source="eslint.rules.no-unused-vars" /><error line="1" column="13" severity="error" message="&apos;bar&apos; is defined but never used. Allowed unused args must match /^_/. (no-unused-vars)" source="eslint.rules.no-unused-vars" /></file></checkstyle>
commit canceled with exit status 1. You have to fix ESLint errors.
```
