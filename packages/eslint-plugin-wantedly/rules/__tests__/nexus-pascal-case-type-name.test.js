const RuleTester = require("eslint").RuleTester;
const ESLintConfigWantedly = require("eslint-config-wantedly/without-react");
const rule = require("../nexus-pascal-case-type-name");

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
const Foo = objectType({
  name: "foo",
  definition(t) {
    t.string("foo", { nullable: true });
  },
});`,
      output: `import { objectType } from "nexus";
const Foo = objectType({
  name: "Foo",
  definition(t) {
    t.string("foo", { nullable: true });
  },
});`,
      errors: ["The objectType name foo should be PascalCase"],
      options: [{ autofix: true }],
    },
    {
      code: `import { unionType } from "nexus";
const MediaType = unionType({
  name: "mediaType",
  description: "Any container type that can be rendered into the feed",
  definition(t) {
    t.members("Post", "Image", "Card");
    t.resolveType((item) => item.name);
  },
});`,
      output: `import { unionType } from "nexus";
const MediaType = unionType({
  name: "MediaType",
  description: "Any container type that can be rendered into the feed",
  definition(t) {
    t.members("Post", "Image", "Card");
    t.resolveType((item) => item.name);
  },
});`,
      errors: ["The unionType name mediaType should be PascalCase"],
      options: [{ autofix: true }],
    },
    {
      code: `import { scalarType } from "nexus";
const DateScalar = scalarType({
  name: "date",
  asNexusMethod: "date",
  description: "Date custom scalar type",
  parseValue(value) { return new Date(value); },
  serialize(value) { return value.getTime(); },
  parseLiteral(ast) {
    if (ast.kind === Kind.INT) {
      return new Date(ast.value);
    }
    return null;
  },
});`,
      output: `import { scalarType } from "nexus";
const DateScalar = scalarType({
  name: "Date",
  asNexusMethod: "date",
  description: "Date custom scalar type",
  parseValue(value) { return new Date(value); },
  serialize(value) { return value.getTime(); },
  parseLiteral(ast) {
    if (ast.kind === Kind.INT) {
      return new Date(ast.value);
    }
    return null;
  },
});`,
      errors: ["The scalarType name date should be PascalCase"],
      options: [{ autofix: true }],
    },
    {
      code: `import { interfaceType } from "nexus";
const Node = interfaceType({
  name: "node",
  definition(t) {
    t.id("id", { description: "GUID for a resource" });
  },
});`,
      output: `import { interfaceType } from "nexus";
const Node = interfaceType({
  name: "Node",
  definition(t) {
    t.id("id", { description: "GUID for a resource" });
  },
});`,
      errors: ["The interfaceType name node should be PascalCase"],
      options: [{ autofix: true }],
    },
    {
      code: `import { inputObjectType } from "nexus";
export const InputType = inputObjectType({
  name: "inputType",
  definition(t) {
    t.string("key", { required: true });
    t.int("answer");
  },
});`,
      output: `import { inputObjectType } from "nexus";
export const InputType = inputObjectType({
  name: "InputType",
  definition(t) {
    t.string("key", { required: true });
    t.int("answer");
  },
});`,
      errors: ["The inputObjectType name inputType should be PascalCase"],
      options: [{ autofix: true }],
    },
    {
      code: `import { enumType } from "nexus";
const Episode = enumType({
  name: "episode",
  members: ["NEWHOPE", "EMPIRE", "JEDI"],
  description: "The first Star Wars episodes released",
});`,
      output: `import { enumType } from "nexus";
const Episode = enumType({
  name: "Episode",
  members: ["NEWHOPE", "EMPIRE", "JEDI"],
  description: "The first Star Wars episodes released",
});`,
      errors: ["The enumType name episode should be PascalCase"],
      options: [{ autofix: true }],
    },
  ],
});
