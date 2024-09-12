import { RuleTester } from "eslint";
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
// import ESLintConfigWantedly from "eslint-config-wantedly-typescript";
import { RULE, RULE_NAME } from "../nexus-field-description";

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
      name: "All fields have no description",
      code: `import { objectType } from "@nexus/schema";
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
