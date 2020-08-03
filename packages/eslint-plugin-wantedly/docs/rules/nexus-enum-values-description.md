# Enforce each of the enum members has description (`wantedly/nexus-enum-values-description`)

## Rule Details

#### Valid

```js
import { enumType } from "@nexus/schema";

export const CountryCode = enumType({
  name: "CountryCode",
  members: [
    { name: "JP", description: "This represents Japan" },
    { name: "US", description: "This represents United States" },
    { name: "FR", description: "This represents France" },
  ],
});
```

#### Invalid

```js
import { enumType } from "@nexus/schema";

export const CountryCode = enumType({
  name: "CountryCode",
  members: [
    // invalid
    "JP", // this is string literal, cannot include a description
    { name: "US" }, // no description property
    { name: "FR", description: "" }, // description is empty string
    { name: "ES", description: "                     " }, // description is empty string
  ],
});
```
