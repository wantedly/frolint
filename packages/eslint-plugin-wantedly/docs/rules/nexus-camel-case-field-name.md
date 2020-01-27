# Check the field name which is camelCase if the code using `nexus` (`wantedly/nexus-camel-case-field-name`)

## Rule Details

#### Valid

```js
import { objectType } from "nexus";

const User = objectType({
  name: "User",
  definition(t) {
    t.string("fullname", { nullable: false });
    t.int("age", { nullable: true });
    t.boolean("isAdmin", { nullable: false });
    t.id("id", { nullable: false });
    t.float("motivation", { nullable: true });
    t.field("profile", { nullable: false });
    t.list.field("posts", { nullable: false });
  },
});
```

#### Invalid

```js
import { objectType } from "nexus";

const User = objectType({
  name: "User",
  definition(t) {
    t.string("Fullname", { nullable: false }); // <- FullName should be fullname
    t.int("Age", { nullable: true });
    t.boolean("IsAdmin", { nullable: false });
    t.id("Id", { nullable: false });
    t.float("Motivation", { nullable: true });
    t.field("Profile", { nullable: false });
    t.list.field("Posts", { nullable: false });
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
    "wantedly/nexus-camel-case-field-name": ["error", { "autofix": true }]
  }
}
```

```js
/* eslint wantedly/nexus-camel-case-field-name: ["error", { "autofix": true }] */
```
