# Check the type name which is PascalCase if the code using `nexus` (`wantedly/nexus-pascal-case-type-name`)

## Rule Details

#### Valid

```js
import { objectType } from "@nexus/schema";

const User = objectType({
  name: "User", // <- name should be PascalCase `User`
  definition(t) {
    t.id("id", { description: "GUID for a resource" });
    t.string("fullname");
  },
});
```

#### Invalid

```js
import { objectType } from "@nexus/schema";

const User = objectType({
  name: "user", // <- name should be PascalCase `User`
  definition(t) {
    t.id("id", { description: "GUID for a resource" });
    t.string("fullname");
  },
});
```

This rule is automatically fix some problems reported by this rule if the `autofix` option is true.

## Options

#### `autofix`

The `autofix` option is enabling the auto fix function.

```json
{
  "rule": {
    "wantedly/nexus-pascal-case-type-name": ["error", { "autofix": true }]
  }
}
```

```js
/* eslint wantedly/nexus-pascal-case-type-name: ["error", { "autofix": true }] */
```
