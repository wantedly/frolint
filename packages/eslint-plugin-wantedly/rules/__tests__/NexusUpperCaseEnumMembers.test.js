const RuleTester = require("eslint").RuleTester;
const ESLintConfigWantedly = require("eslint-config-wantedly/without-react");
const rule = require("../NexusUpperCaseEnumMembers");

RuleTester.setDefaultConfig({
  parser: require.resolve(ESLintConfigWantedly.parser),
  parserOptions: ESLintConfigWantedly.parserOptions,
});

const ruleTester = new RuleTester();
ruleTester.run(rule.RULE_NAME, rule.RULE, {
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
