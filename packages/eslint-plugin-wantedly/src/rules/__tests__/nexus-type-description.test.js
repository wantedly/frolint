const RuleTester = require("eslint").RuleTester;
const ESLintConfigWantedly = require("eslint-config-wantedly/without-react");
const rule = require("../nexus-type-description");

RuleTester.setDefaultConfig({
  parser: require.resolve(ESLintConfigWantedly.parser),
  parserOptions: ESLintConfigWantedly.parserOptions,
});

const ruleTester = new RuleTester();
ruleTester.run(rule.RULE_NAME, rule.RULE, {
  valid: [
    {
      code: `import { objectType } from "nexus";
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
      code: `import { objectType } from "nexus";
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
      code: `import { objectType } from "nexus";
const Foo = objectType({
  name: "Foo",
  definition(t) {
    t.string("foo", { nullable: true });
  },
});`,
      errors: ["The object type Foo should have a description"],
    },
    {
      code: `import { objectType } from "nexus";
const Foo = objectType({
  name: "Foo",
  definition(t) { t.string("foo", { nullable: true }); },
});`,
      errors: ["The object type Foo should have a description"],
    },

    {
      code: `import { unionType } from "nexus";
const Foo = unionType({
  name: "Foo",
  definition(t) { t.members("Bar", "Baz"); },
});`,
      errors: ["The union type Foo should have a description"],
    },

    {
      code: `import { scalarType } from "nexus";
const Foo = scalarType({
  name: "Foo",
  serialize(v) { return v; },
});`,
      errors: ["The scalar type Foo should have a description"],
    },

    {
      code: `import { interfaceType } from "nexus";
const Foo = interfaceType({
  name: "Foo",
  definition(t) { t.string("foo", { nullable: true }); },
});`,
      errors: ["The interface type Foo should have a description"],
    },

    {
      code: `import { inputObjectType } from "nexus";
const Foo = inputObjectType({
  name: "Foo",
  definition(t) { t.string("foo", { nullable: true }); },
});`,
      errors: ["The input object type Foo should have a description"],
    },

    {
      code: `import { enumType } from "nexus";
const Foo = enumType({
  name: "Foo",
  members: ["BAR", "BAZ"],
});`,
      errors: ["The enum type Foo should have a description"],
    },
  ],
});
