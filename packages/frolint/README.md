# frolint [![npm version](https://badge.fury.io/js/frolint.svg)](https://badge.fury.io/js/frolint)

## Overview

Install depending on your package manager:
```sh
yarn add -D frolint
```
```sh
npm install -D frolint
```

And you should use the export command if you want to use prettier configuration with your favorite editor.

```sh
yarn frolint export
```

## Usage

You can use this package as a standalone dependency, it will use the default configurations.

If you want to amend the ESLint configuration, you must add a `.eslintrc` at the root directory of your project. Then to still make use of our curated defaults, start by extending our configs. For example in a typescript project:

``` javascript
{
  "extends": "wantedly-typescript",
  // your config..
}
```

### Git commit hook

When you intend to commit some files including JS / TS files, the `frolint` reports if the code has some ESLint errors and warnings. If the code has **ESLint errors**, the commit is canceled. If your changes include only **ESLint warnings**, the commit is allowed but you should resolve the warnings as they will continue to appear.

```sh
git commit
```
``` 
Detected 2 errors, 0 warnings
./foo.js: 2 errors, 0 warnings found.
  ./foo.js:1:7 'foo' is assigned a value but never used. Allowed unused vars must match /^_/. (no-unused-vars)
  ./foo.js:1:13 'bar' is defined but never used. Allowed unused args must match /^_/. (no-unused-vars)
commit canceled with exit status 1. You have to fix ESLint errors.
```

To setup this commit hook, run the `install command`:

``` sh
yarn exec frolint install
```

### Prettier

Despite its name of linter, `frolint` also formats the code with the famous `prettier` tool. So applies the ESLint auto-fixable errors first, then applies the `prettier` formatting. We use a `.prettierrc` as below:

```json
{
  "printWidth": 120,
  "useTabs": false,
  "semi": true,
  "singleQuote": false,
  "trailingComma": "es5",
  "bracketSpacing": true,
  "bracketSameLine": false,
  "endOfLine": "lf"
}
```

### Help
If you want to know the options, `frolint --help` is helpful.

```
FROntend LINt Tool - 2.3.0

  $ frolint <command>

Where <command> is one of:

  frolint --version
    print version

  frolint [--typescript] [-b,--branch #0] [--expect-no-diff] [--expect-no-errors,--bail] [-f,--formatter #0] [--no-stage]
    apply ESLint and Prettier

  frolint export
    export config files when the files are not exist

  frolint print-config <filepath>
    Print the configuration for the given file

Around .git/hooks/pre-commit:

  frolint install
    install git pre-commit hook for frolint

  frolint uninstall
    uninstall git pre-commit hook for frolint

You can also print more details about any of these commands by calling them 
after adding the `-h,--help` flag right after the command name.
Apply ESLint and Prettier

Usage:

$ frolint [--typescript] [-b,--branch #0] [--expect-no-diff] [--expect-no-errors,--bail] [-f,--formatter #0] [--no-stage]

Details:

Apply ESLint and Prettier. It infers the affected files which are changed from 
base branch using git.

Options:

--typescript: Use @typescript-eslint/parser as ESLint parser

-b,--branch <branch name>: Find the changed files from the specified branch

--expect-no-diff: Fail when the changed files exist

--expect-no-errors: Fail out on the error instead of tolerating it (previously 
--bail option)

-f,--formatter <format>: Print the report with specified format

--no-stage: Do not stage the files which have the changes made by ESLint and 
Prettier auto fix functionality

Examples:

Default usage
  $ yarn frolint

Diff with the specified branch
  $ yarn frolint --branch master

Print report as stylish
  $ yarn frolint --formatter stylish

Use with reviewdog
  $ yarn frolint --formatter checkstyle | reviewdog -f=checkstyle -name="lint" -reporter=github-pr-review
```

In non git project, help option provides specific helps as below:

```
$ yarn frolint --help
yarn run v1.13.0
$ /Users/yamadayuki/dev/src/github.com/yamadayuki/sample/node_modules/.bin/frolint --help

frolint - FROntend LINT tool

Usage:
  frolint [flags]

Available Flags:
  -h, --help        help for frolint
  -f, --formatter   the ESLint formatter to print lint errors and warnings
  -F, --files       pass the files to analyze with ESLint
```

### `frolint` as CLI

If you want to check all files in the repository, you can use the `frolint` as a binary.

```sh
yarn exec frolint
```
```
No errors and warnings!
✨  Done in 2.36s.
```

#### `frolint export`

Create the `.prettierrc` config file based on the default config in `frolint`.

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

You can specify the ESLint formatter as string (default is `undefined`). If you don't specify the formatter, `frolint` reports the ESLint issues using original formatter. If you want to using ESLint formatter (e.g. `checkstyle`), you can specify the `formatter` property.

```json
{
  "frolint": {
    "formatter": "checkstyle"
  }
}
```

```sh
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

### `prettier` property

Now, `frolint` supports Prettier. So `frolint` command format the code automatically. If you specify the `frolint.prettier.config` property, you can use your `.prettierrc` to format the code.

```json
{
  "frolint": {
    "prettier": {
      "config": "./.prettierrc"
    }
  }
}
```

### Debugging

If you want to watch debug log, you can use `DEBUG=frolint:*` environment variable to output debugging information to the console via the `debug` package.

```console
> DEBUG=frolint:* yarn frolint
...
  frolint:DefaultCommand Start stagings files +552ms
  frolint:DefaultCommand Start reporting results to console +4ms
  frolint:report Start reporting using frolint format +0ms
  frolint:report No errors and warnings +0ms
No errors and warnings!
  frolint:DefaultCommand Execution finished +1ms
  frolint:main Linting and Formatting complete +1s
```
