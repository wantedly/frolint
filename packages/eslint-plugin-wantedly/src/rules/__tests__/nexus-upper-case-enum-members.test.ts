import { RuleTester } from "eslint";
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import ESLintConfigWantedly from "eslint-config-wantedly/without-react";
import { RULE, RULE_NAME } from "../nexus-upper-case-enum-members";

new RuleTester({
  parser: require.resolve(ESLintConfigWantedly.parser),
  parserOptions: ESLintConfigWantedly.parserOptions,
}).run(RULE_NAME, RULE, {
  valid: [],
  invalid: [
    {
      code: `import { enumType } from "nexus";
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
      code: `import { enumType } from "nexus";
const Episode = enumType({
  name: "Episode",
  members: ["newHope", "empire", "jedi"],
});`,
      output: `import { enumType } from "nexus";
const Episode = enumType({
  name: "Episode",
  members: ["NEW_HOPE", "EMPIRE", "JEDI"],
});`,
      errors: [
        "The enum member `Episode.newHope` should be UPPER_CASE",
        "The enum member `Episode.empire` should be UPPER_CASE",
        "The enum member `Episode.jedi` should be UPPER_CASE",
      ],
      options: [{ autofix: true }],
    },

    {
      code: `import { enumType } from "nexus";
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
      code: `import { enumType } from "nexus";
const Episode = enumType({
  name: "Episode",
  members: [
    { name: "newHope" },
    { name: "empire" },
    { name: "jedi" },
  ],
});`,
      output: `import { enumType } from "nexus";
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
      options: [{ autofix: true }],
    },

    {
      code: `import { enumType } from "nexus";
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
      code: `import { enumType } from "nexus";
const Episode = enumType({
  name: "Episode",
  members: { newhope: 1, empire: 2, jedi: 3 },
});`,
      output: `import { enumType } from "nexus";
const Episode = enumType({
  name: "Episode",
  members: { NEWHOPE: 1, EMPIRE: 2, JEDI: 3 },
});`,
      errors: [
        "The enum member `Episode.newhope` should be UPPER_CASE",
        "The enum member `Episode.empire` should be UPPER_CASE",
        "The enum member `Episode.jedi` should be UPPER_CASE",
      ],
      options: [{ autofix: true }],
    },

    {
      code: `import { enumType } from "nexus";
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
      code: `import { enumType } from "nexus";
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
