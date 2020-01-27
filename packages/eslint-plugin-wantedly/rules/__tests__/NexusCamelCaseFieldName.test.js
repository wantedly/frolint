const RuleTester = require("eslint").RuleTester;
const ESLintConfigWantedly = require("eslint-config-wantedly/without-react");
const NexusCamelCaseFieldName = require("../NexusCamelCaseFieldName");

RuleTester.setDefaultConfig({
  parser: require.resolve(ESLintConfigWantedly.parser),
  parserOptions: ESLintConfigWantedly.parserOptions,
});

const ruleTester = new RuleTester();
ruleTester.run(NexusCamelCaseFieldName.RULE_NAME, NexusCamelCaseFieldName.RULE, {
  valid: [],
  invalid: [
    {
      code: `import { objectType } from "nexus";
const User = objectType({
  name: "User",
  definition(t) {
    t.string("FullName", { nullable: false });
    t.int("Age", { nullable: true });
    t.boolean("IsAdmin", { nullable: false });
    t.id("Id", { nullable: false });
    t.float("Motivation", { nullable: true });
    t.field("Profile", { nullable: false });
    t.list.field("Posts", { nullable: false });
  },
});`,
      errors: [
        "The field FullName should be camelCase",
        "The field Age should be camelCase",
        "The field IsAdmin should be camelCase",
        "The field Id should be camelCase",
        "The field Motivation should be camelCase",
        "The field Profile should be camelCase",
        "The field Posts should be camelCase",
      ],
    },
    {
      code: `import { objectType } from "nexus";
    const User = objectType({
      name: "User",
      definition(t) {
        t.string("FullName", { nullable: false });
        t.int("Age", { nullable: true });
        t.boolean("IsAdmin", { nullable: false });
        t.id("Id", { nullable: false });
        t.float("Motivation", { nullable: true });
        t.field("Profile", { nullable: false });
        t.list.field("Posts", { nullable: false });
      },
    });`,
      output: `import { objectType } from "nexus";
    const User = objectType({
      name: "User",
      definition(t) {
        t.string("fullName", { nullable: false });
        t.int("age", { nullable: true });
        t.boolean("isAdmin", { nullable: false });
        t.id("id", { nullable: false });
        t.float("motivation", { nullable: true });
        t.field("profile", { nullable: false });
        t.list.field("posts", { nullable: false });
      },
    });`,
      errors: [
        "The field FullName should be camelCase",
        "The field Age should be camelCase",
        "The field IsAdmin should be camelCase",
        "The field Id should be camelCase",
        "The field Motivation should be camelCase",
        "The field Profile should be camelCase",
        "The field Posts should be camelCase",
      ],
      options: [{ autofix: true }],
    },
  ],
});
