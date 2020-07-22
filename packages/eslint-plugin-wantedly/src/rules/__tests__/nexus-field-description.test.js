const RuleTester = require("eslint").RuleTester;
const ESLintConfigWantedly = require("eslint-config-wantedly/without-react");
const rule = require("../nexus-field-description");

RuleTester.setDefaultConfig({
  parser: require.resolve(ESLintConfigWantedly.parser),
  parserOptions: ESLintConfigWantedly.parserOptions,
});

const ruleTester = new RuleTester();
ruleTester.run(rule.RULE_NAME, rule.RULE, {
  valid: [],
  invalid: [
    {
      code: `import { objectType } from "nexus";
const User = objectType({
  name: "User",
  definition(t) {
    t.string("fullName");
    t.int("age", { nullable: true });
    t.boolean("isAdmin", { nullable: false, description: "" });
    t.id("id", { nullable: false, description: "     " });
    t.float("motivation", { nullable: true });
    t.field("profile", { nullable: false });
    t.list.field("posts", { nullable: false });
  },
});`,
      errors: [
        "The field fullName should have a description",
        "The field age should have a description",
        "The field isAdmin should have a description",
        "The field id should have a description",
        "The field motivation should have a description",
        "The field profile should have a description",
        "The field posts should have a description",
      ],
    },
  ],
});
