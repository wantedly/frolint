import { RuleTester } from "eslint";

// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
// import ESLintConfigWantedly from "eslint-config-wantedly-typescript";
import { RULE, RULE_NAME } from "../nexus-camel-case-field-name";

const ruleTester = new RuleTester({
  languageOptions: {
    ecmaVersion: "latest",
    // parser: require.resolve(ESLintConfigWantedly.parser),
    // parserOptions: ESLintConfigWantedly.parserOptions,
  },
});
ruleTester.run(RULE_NAME, RULE, {
  valid: [],
  invalid: [
    {
      name: "All fields are Pascal case",
      code: `import { objectType } from "@nexus/schema";
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
      options: ["error"],
    },
    {
      name: "Auto fix enabled",
      code: `import { objectType } from "@nexus/schema";
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
      output: `import { objectType } from "@nexus/schema";
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
      options: ["error", { autofix: true }],
    },
  ],
});
