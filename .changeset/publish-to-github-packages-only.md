---
"@wantedly/eslint-config-wantedly": minor
"@wantedly/eslint-config-wantedly-typescript": minor
"@wantedly/eslint-plugin-use-macros": minor
"@wantedly/eslint-plugin-wantedly": minor
"@wantedly/frolint": minor
"@wantedly/prettier-config-wantedly": minor
---

Publish to GitHub Packages only as private (restricted) `@wantedly/*` scoped packages, and stop publishing to npm. Internal dependencies now reference the `@wantedly/*` packages, so consumers need `@wantedly:registry=https://npm.pkg.github.com` in their `.npmrc`.
