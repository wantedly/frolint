import { RuleTester } from "eslint";
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import ESLintConfigWantedly from "eslint-config-wantedly-typescript";
import { RULE, RULE_NAME } from "../nexus-type-description";

new RuleTester({
  parser: require.resolve(ESLintConfigWantedly.parser),
  parserOptions: ESLintConfigWantedly.parserOptions,
}).run(RULE_NAME, RULE, {
  valid: [
    {
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
      code: `import { objectType } from "@nexus/schema";
const Foo = objectType({
  name: "Foo",
  definition(t) { t.string("foo", { nullable: true }); },
});`,
      errors: ["The object type Foo should have a description"],
    },

    {
      code: `import { unionType } from "@nexus/schema";
const Foo = unionType({
  name: "Foo",
  definition(t) { t.members("Bar", "Baz"); },
});`,
      errors: ["The union type Foo should have a description"],
    },

    {
      code: `import { scalarType } from "@nexus/schema";
const Foo = scalarType({
  name: "Foo",
  serialize(v) { return v; },
});`,
      errors: ["The scalar type Foo should have a description"],
    },

    {
      code: `import { interfaceType } from "@nexus/schema";
const Foo = interfaceType({
  name: "Foo",
  definition(t) { t.string("foo", { nullable: true }); },
});`,
      errors: ["The interface type Foo should have a description"],
    },

    {
      code: `import { inputObjectType } from "@nexus/schema";
const Foo = inputObjectType({
  name: "Foo",
  definition(t) { t.string("foo", { nullable: true }); },
});`,
      errors: ["The input object type Foo should have a description"],
    },

    {
      code: `import { enumType } from "@nexus/schema";
const Foo = enumType({
  name: "Foo",
  members: ["BAR", "BAZ"],
});`,
      errors: ["The enum type Foo should have a description"],
    },
  ],
});
