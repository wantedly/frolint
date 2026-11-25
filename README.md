# frolint - FROntend LINT

![Node CI](https://github.com/wantedly/frolint/workflows/Node%20CI/badge.svg)

This is a monorepo that contains our common linting and formatting configurations for Wantedly's javascript projects.

The `frolint` CLI is deprecated and has been removed from this repository. Its last version is [4.0.0](https://github.com/wantedly/frolint/tree/frolint%404.0.0/packages/frolint). Use [husky](https://typicode.github.io/husky/) and [lint-staged](https://github.com/lint-staged/lint-staged) with the ESLint and Prettier configs below instead.

## Packages

- [@wantedly/eslint-config-wantedly-typescript](https://github.com/wantedly/frolint/tree/master/packages/eslint-config-wantedly-typescript)
- [@wantedly/eslint-config-wantedly](https://github.com/wantedly/frolint/tree/master/packages/eslint-config-wantedly)
- [@wantedly/eslint-plugin-use-macros](https://github.com/wantedly/frolint/tree/master/packages/eslint-plugin-use-macros)
- [@wantedly/eslint-plugin-wantedly](https://github.com/wantedly/frolint/tree/master/packages/eslint-plugin-wantedly)
- [@wantedly/prettier-config-wantedly](https://github.com/wantedly/frolint/tree/master/packages/prettier-config-wantedly)

All packages are published to [GitHub Packages](https://github.com/orgs/wantedly/packages?repo_name=frolint) only (not npm).
To install them, add the following line to `.npmrc` in your project and authenticate to GitHub Packages with a token that has the `read:packages` scope.

```
@wantedly:registry=https://npm.pkg.github.com
```

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
