# Validate that the fields have descriptions if the code using `nexus` (`wantedly/nexus-field-description`)

## Rule Details

#### Valid

```js
import { objectType } from "nexus";

const User = objectType({
  name: "User",
  definition(t) {
    t.id("id", { nullable: false, description: "Represents the Object Global Identification" });
  },
});
```

#### Invalid

```js
import { objectType } from "nexus";

const User = objectType({
  name: "User",
  definition(t) {
    // invalid
    t.string("fullName"); // this cannot include a description in second parameter
    t.int("age", { nullable: true }); // no description property
    t.boolean("isAdmin", { nullable: false, description: "" }); // description is an empty string
    t.id("id", { nullable: false, description: "          " }); // description is an empty string
  },
});
```
