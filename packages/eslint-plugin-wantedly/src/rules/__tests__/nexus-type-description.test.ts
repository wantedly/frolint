import { RuleTester } from "eslint";

// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
// import ESLintConfigWantedly from "eslint-config-wantedly-typescript";
import { RULE, RULE_NAME } from "../nexus-type-description";

new RuleTester({
  languageOptions: {
    ecmaVersion: "latest",
    // parser: require.resolve(ESLintConfigWantedly.parser),
    // parserOptions: ESLintConfigWantedly.parserOptions,
  },
}).run(RULE_NAME, RULE, {
  valid: [
    {
      name: "Object type def has description",
      code: `import { objectType } from "@nexus/schema";
const Foo = objectType({
  name: "Foo",
  definition(t) {
    t.string("foo", { nullable: true });
  },
  description: "Foo represents the foo"
});`,
    },
  ],
  invalid: [
    {
      name: "Object type def has no description(empty string)",
      code: `import { objectType } from "@nexus/schema";
const Foo = objectType({
  name: "Foo",
  definition(t) {
    t.string("foo", { nullable: true });
  },
  description: ""
});`,
      errors: ["The object type Foo should have a description"],
    },
    {
      name: "Object type def has no description(field missing)",
      code: `import { objectType } from "@nexus/schema";
const Foo = objectType({
  name: "Foo",
  definition(t) {
    t.string("foo", { nullable: true });
  },
});`,
      errors: ["The object type Foo should have a description"],
    },
    {
      name: "Object type def has no description(field missing)",
      code: `import { objectType } from "@nexus/schema";
const Foo = objectType({
  name: "Foo",
  definition(t) { t.string("foo", { nullable: true }); },
});`,
      errors: ["The object type Foo should have a description"],
    },

    {
      name: "Union type def has no description",
      code: `import { unionType } from "@nexus/schema";
const Foo = unionType({
  name: "Foo",
  definition(t) { t.members("Bar", "Baz"); },
});`,
      errors: ["The union type Foo should have a description"],
    },

    {
      name: "Scalar type def has no description",
      code: `import { scalarType } from "@nexus/schema";
const Foo = scalarType({
  name: "Foo",
  serialize(v) { return v; },
});`,
      errors: ["The scalar type Foo should have a description"],
    },

    {
      name: "Interface type def has no description",
      code: `import { interfaceType } from "@nexus/schema";
const Foo = interfaceType({
  name: "Foo",
  definition(t) { t.string("foo", { nullable: true }); },
});`,
      errors: ["The interface type Foo should have a description"],
    },

    {
      name: "Input object type def has no description",
      code: `import { inputObjectType } from "@nexus/schema";
const Foo = inputObjectType({
  name: "Foo",
  definition(t) { t.string("foo", { nullable: true }); },
});`,
      errors: ["The input object type Foo should have a description"],
    },

    {
      name: "Enum type def has no description",
      code: `import { enumType } from "@nexus/schema";
const Foo = enumType({
  name: "Foo",
  members: ["BAR", "BAZ"],
});`,
      errors: ["The enum type Foo should have a description"],
    },
  ],
});
