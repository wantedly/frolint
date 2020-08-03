# Validate that the types have descriptions if the code using `nexus` (`wantedly/nexus-type-description`)

## Rule Details

#### Valid

```js
import { objectType } from "@nexus/schema";

const Foo = objectType({
  name: "Foo",
  definitions(t) {
    // define fields
  },
  description: "Foo represents the record of Foo",
});
```

#### Invalid

```js
import { objectType } from "@nexus/schema";

const Foo = objectType({
  name: "Foo",
  definitions(t) {
    // define fields
  },
  // missing description field or the description is empty string
});
```
