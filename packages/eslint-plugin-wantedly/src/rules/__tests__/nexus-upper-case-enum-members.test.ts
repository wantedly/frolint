import { RuleTester } from "eslint";
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
// import ESLintConfigWantedly from "eslint-config-wantedly-typescript";
import { RULE, RULE_NAME } from "../nexus-upper-case-enum-members";

new RuleTester({
  languageOptions: {
    ecmaVersion: "latest",
    // parser: require.resolve(ESLintConfigWantedly.parser),
    // parserOptions: ESLintConfigWantedly.parserOptions,
  },
}).run(RULE_NAME, RULE, {
  valid: [],
  invalid: [
    {
      name: "Enum member is no UPPER_CASE (string array def)",
      code: `import { enumType } from "@nexus/schema";
const Episode = enumType({
  name: "Episode",
  members: ["newhope", "empire", "jedi"],
});`,
      errors: [
        "The enum member `Episode.newhope` should be UPPER_CASE",
        "The enum member `Episode.empire` should be UPPER_CASE",
        "The enum member `Episode.jedi` should be UPPER_CASE",
      ],
    },
    {
      name: "Enum member is fixed to UPPER_CASE by plugin",
      code: `import { enumType } from "@nexus/schema";
const Episode = enumType({
  name: "Episode",
  members: ["newHope", "empire", "jedi"],
});`,
      output: `import { enumType } from "@nexus/schema";
const Episode = enumType({
  name: "Episode",
  members: ["NEW_HOPE", "EMPIRE", "JEDI"],
});`,
      errors: [
        "The enum member `Episode.newHope` should be UPPER_CASE",
        "The enum member `Episode.empire` should be UPPER_CASE",
        "The enum member `Episode.jedi` should be UPPER_CASE",
      ],
      options: ["error", { autofix: true }],
    },

    {
      name: "Enum member is not UPPER_CASE (object array def)",
      code: `import { enumType } from "@nexus/schema";
const Episode = enumType({
  name: "Episode",
  members: [
    { name: "newhope" },
    { name: "empire" },
    { name: "jedi" },
  ],
});`,
      errors: [
        "The enum member `Episode.newhope` should be UPPER_CASE",
        "The enum member `Episode.empire` should be UPPER_CASE",
        "The enum member `Episode.jedi` should be UPPER_CASE",
      ],
    },
    {
      name: "Enum member is fixed to UPPER_CASE by the plugin (object array def)",
      code: `import { enumType } from "@nexus/schema";
const Episode = enumType({
  name: "Episode",
  members: [
    { name: "newHope" },
    { name: "empire" },
    { name: "jedi" },
  ],
});`,
      output: `import { enumType } from "@nexus/schema";
const Episode = enumType({
  name: "Episode",
  members: [
    { name: "NEW_HOPE" },
    { name: "EMPIRE" },
    { name: "JEDI" },
  ],
});`,
      errors: [
        "The enum member `Episode.newHope` should be UPPER_CASE",
        "The enum member `Episode.empire` should be UPPER_CASE",
        "The enum member `Episode.jedi` should be UPPER_CASE",
      ],
      options: ["error", { autofix: true }],
    },

    {
      name: "Enum member is not UPPER_CASE (object def)",
      code: `import { enumType } from "@nexus/schema";
const Episode = enumType({
  name: "Episode",
  members: { newhope: 1, empire: 2, jedi: 3 },
});`,
      errors: [
        "The enum member `Episode.newhope` should be UPPER_CASE",
        "The enum member `Episode.empire` should be UPPER_CASE",
        "The enum member `Episode.jedi` should be UPPER_CASE",
      ],
    },
    {
      name: "Enum member is fixed to UPPER_CASE by the plugin (object def)",
      code: `import { enumType } from "@nexus/schema";
const Episode = enumType({
  name: "Episode",
  members: { newhope: 1, empire: 2, jedi: 3 },
});`,
      output: `import { enumType } from "@nexus/schema";
const Episode = enumType({
  name: "Episode",
  members: { NEWHOPE: 1, EMPIRE: 2, JEDI: 3 },
});`,
      errors: [
        "The enum member `Episode.newhope` should be UPPER_CASE",
        "The enum member `Episode.empire` should be UPPER_CASE",
        "The enum member `Episode.jedi` should be UPPER_CASE",
      ],
      options: ["error", { autofix: true }],
    },

    {
      name: "Enum member is not UPPER_CASE (array def is outside of enumType)",
      code: `import { enumType } from "@nexus/schema";
const members = ["newhope", "empire", "jedi"];
const Episode = enumType({
  name: "Episode",
  members,
});`,
      errors: [
        "The enum member `Episode.newhope` should be UPPER_CASE",
        "The enum member `Episode.empire` should be UPPER_CASE",
        "The enum member `Episode.jedi` should be UPPER_CASE",
      ],
    },

    {
      name: "Enum member is not UPPER_CASE (object def is outside of enumType)",
      code: `import { enumType } from "@nexus/schema";
const members = { newhope: 1, empire: 2, jedi: 3 };
const Episode = enumType({
  name: "Episode",
  members,
});`,
      errors: [
        "The enum member `Episode.newhope` should be UPPER_CASE",
        "The enum member `Episode.empire` should be UPPER_CASE",
        "The enum member `Episode.jedi` should be UPPER_CASE",
      ],
    },
  ],
});
