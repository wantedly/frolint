# Check the enum members are UPPER_CASE if the code using `nexus` (`wantedly/nexus-upper-case-enum-members`)

## Rule Details

#### Valid

```js
import { enumType } from "@nexus/schema";

// Array literal
const Episode = enumType({
  name: "Episode",
  members: ["NEW_HOPE", "EMPIRE", "JEDI"],
});

// Object literal
const Episode = enumType({
  name: "Episode",
  members: { NEW_HOPE: 1, EMPIRE: 2, JEDI: 3 },
});
```

#### Invalid

```js
import { enumType } from "@nexus/schema";

// Array literal
const Episode = enumType({
  name: "Episode",
  members: ["newHope", "empire", "jedi"],
});

// Object literal
const Episode = enumType({
  name: "Episode",
  members: { newHope: 1, empire: 2, jedi: 3 },
});
```

This rule is automatically fix some problems reported by this rule if the `autofix` option is true.

## Options

#### `autofix`

The `autofix` option is enabling the auto fix function.

```json
{
  "rule": {
    "wantedly/nexus-upper-case-enum-members": ["error", { "autofix": true }]
  }
}
```

```js
/* eslint wantedly/nexus-upper-case-enum-members: ["error", { "autofix": true }] */
```
