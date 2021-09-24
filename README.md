# frolint - FROntend LINT

![Node CI](https://github.com/wantedly/frolint/workflows/Node%20CI/badge.svg)

This is a monorepo that contains our common linting and formatting configurations for Wantedly's javascript projects.

If you are looking for the `frolint` executable documentation, please see here: [frolint Readme](https://github.com/wantedly/frolint/tree/master/packages/frolint)

## Packages

- [eslint-config-wantedly-typescript](https://github.com/wantedly/frolint/tree/master/packages/eslint-config-wantedly-typescript) [![npm version](https://badge.fury.io/js/eslint-config-wantedly-typescript.svg)](https://badge.fury.io/js/eslint-config-wantedly-typescript)
- [eslint-config-wantedly](https://github.com/wantedly/frolint/tree/master/packages/eslint-config-wantedly) [![npm version](https://badge.fury.io/js/eslint-config-wantedly.svg)](https://badge.fury.io/js/eslint-config-wantedly)
- [eslint-plugin-use-macros](https://github.com/wantedly/frolint/tree/master/packages/eslint-plugin-use-macros) [![npm version](https://badge.fury.io/js/eslint-plugin-use-macros.svg)](https://badge.fury.io/js/eslint-plugin-use-macros)
- [eslint-plugin-wantedly](https://github.com/wantedly/frolint/tree/master/packages/eslint-plugin-wantedly) [![npm version](https://badge.fury.io/js/eslint-plugin-wantedly.svg)](https://badge.fury.io/js/eslint-plugin-wantedly)
- [frolint](https://github.com/wantedly/frolint/tree/master/packages/frolint) [![npm version](https://badge.fury.io/js/frolint.svg)](https://badge.fury.io/js/frolint)
- [prettier-config-wantedly](https://github.com/wantedly/frolint/tree/master/packages/prettier-config-wantedly) [![npm version](https://badge.fury.io/js/prettier-config-wantedly.svg)](https://badge.fury.io/js/prettier-config-wantedly)

<details>

```fish
# Create above list with fish shell script
for package in (yarn -s lerna ls --loglevel silent)
    echo "- [$package](https://github.com/wantedly/frolint/tree/master/packages/$package) [![npm version](https://badge.fury.io/js/$package.svg)](https://badge.fury.io/js/$package)"
end
```

</details>

## How to contribute

PRs are welcome, see the current issues open.

We are developing this project with [Lerna](https://github.com/lerna/lerna). 

Clone the repository and run

```sh
yarn
```

This will also trigger the lerna bootstraping process.

Running Tests:

```sh
# Runs all unit tests
yarn test

# Runs all unit tests with updating snapshots
yarn test:update
```

## License

MIT
