# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Overview

Monorepo of Wantedly's shared JavaScript/TypeScript linting and formatting packages, published to npm. Managed with Yarn workspaces + Lerna (`version: independent`), released via Changesets.

## Commands

```sh
yarn                     # install; postinstall runs `lerna bootstrap`
yarn build               # tsc -b for TS packages (frolint, eslint-plugin-wantedly)
yarn build:watch
yarn test                # pretest runs `yarn build` first, then lerna run test
yarn test:update         # update jest snapshots across packages
yarn test:watch          # watch all packages except prettier-config-wantedly
yarn test:watch:frolint
yarn lint                # eslint --cache (expects file args; lint-staged supplies them)
yarn format              # prettier --write (same; expects file args)
yarn clean               # lerna clean + remove packages/*/lib
```

Run a single package's tests from its directory (jest is hoisted to the root):

```sh
cd packages/eslint-plugin-wantedly
yarn jest src/rules/__tests__/graphql-operation-name.test.ts -t "Operation name"
```

`yarn build` must run before testing `frolint` or `eslint-plugin-wantedly` — both compile `src/` to `lib/`, and `main`/`bin` point at `lib/`.

Lint/format is enforced through husky `pre-commit` → `lint-staged` (`yarn format` + `yarn lint` on staged `*.{ts,tsx,js,mjs}`), and CI reruns lint-staged over the PR diff range.

## Release flow

Changesets, not manual version bumps. Add a changeset for any user-visible change:

```sh
yarn changeset
```

Pushing to `master` opens/updates a release PR (`.github/workflows/release.yml`); merging it publishes to npm.

## Architecture

Six packages, layered — a change to a lower layer ripples upward:

- `prettier-config-wantedly` — `index.json`, the Prettier config. No build, no tests.
- `eslint-plugin-use-macros` (plain JS) — rules forcing `.macro` imports for `graphql-tag` / `styled-components`. Rules built by a shared `createUseMacro.js` factory.
- `eslint-plugin-wantedly` (TypeScript) — opinionated GraphQL/Nexus rules.
- `eslint-config-wantedly` / `eslint-config-wantedly-typescript` (plain JS) — flat-config rule sets consuming the two plugins above.
- `frolint` (TypeScript) — the CLI, consuming the configs. **Deprecated**: v4 supports ESLint 9 but v10+ will not be supported; the README steers users to husky + lint-staged instead.

### ESLint configs

Each config package exports `{ base, react }` from `index.js` — arrays of flat-config objects, not a single object. `base.js` is the JS/TS core; `react.js` spreads `base` and adds React/React Hooks rules. The TypeScript variant layers `typescript-eslint` on top of the same shape.

The repo dogfoods its own configs: `eslint.config.mjs` imports `base` from both config packages.

Config tests are snapshot tests of the *resolved* config: `new ESLint({ baseConfig, overrideConfigFile: true }).calculateConfigForFile("test.ts")` → `toMatchSnapshot()`. Any rule change requires `yarn test:update`, and the snapshot diff is the review surface — check it. `eslint-config-wantedly-typescript` needs a custom jest resolver (`export_maps_resolver.js`) to handle package export maps.

### eslint-plugin-wantedly rules

Each rule file in `src/rules/` exports exactly two names, and `src/index.ts` registers them into the plugin's `rules` map:

```ts
export const RULE_NAME = "graphql-operation-name";
export const RULE: Rule.RuleModule = { meta: { ... }, create(context) { ... } };
```

Conventions across rules: options are merged over a `DEFAULT_OPTION` literal via `getOptionWithDefault` (most rules take `{ autofix: boolean }`, defaulting to `false`); `meta.docs.url` comes from `docsUrl(RULE_NAME)`; peer libraries (`graphql`, `@nexus/schema`) are probed with `require.resolve` in a try/catch and the rule returns `{}` when absent — never import them at the top level. Tests use `RuleTester` with `languageOptions`.

Scaffold a new rule (generates rule, test, and `docs/rules/<name>.md`):

```sh
yarn scaffdog generate eslint-plugin-wantedly-rule
```

⚠️ The scaffdog template (`.scaffdog/eslint-plugin-wantedly-rule.md`) is stale — it emits `new Linter().defineRule(...)` and legacy `RuleTester` parser options, which ESLint 9 dropped. Fix the generated output to match an existing rule such as `src/rules/graphql-operation-name.ts`. A new rule also needs a manual entry in `src/index.ts` and the package README's rule list.

### frolint CLI

`src/index.ts` builds a clipanion `Cli`, loads config with cosmiconfig (`.frolintrc`, etc.), and injects a `FrolintContext` (`src/Context.ts`: `cwd`, `config`, `preCommit`, `version`, `debug`) into every command. Commands live in `src/commands/` — `DefaultCommand` holds the real pipeline; `PreCommitCommand` sets `preCommit` and delegates.

`DefaultCommand` flow: resolve git root → select target files (staged+unstaged in pre-commit mode, diff vs `--branch`, or all files) → `applyEslint` → write fixes → `applyPrettier` → write fixes → re-stage fully-staged files → report. Exit code 1 when errors remain in staged files, or per `--expect-no-errors` / `--expect-no-diff`.

Note `DefaultCommand` mutates `module.paths` to resolve plugins out of the sibling `eslint-config-wantedly*` package's dependencies — it assumes a flat `node_modules/` layout. Debug logging is namespaced via `debug` (`this.context.debug("Name")`); run with `DEBUG=frolint:*`.
