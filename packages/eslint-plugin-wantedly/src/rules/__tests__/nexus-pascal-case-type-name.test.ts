import { RuleTester } from "eslint";
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
// import ESLintConfigWantedly from "eslint-config-wantedly-typescript";
import { RULE, RULE_NAME } from "../nexus-pascal-case-type-name";

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
      name: "Object type name is not PascalCase",
      code: `import { objectType } from "@nexus/schema";
const Foo = objectType({
  name: "foo",
  definition(t) {
    t.string("foo", { nullable: true });
  },
});`,
      output: `import { objectType } from "@nexus/schema";
const Foo = objectType({
  name: "Foo",
  definition(t) {
    t.string("foo", { nullable: true });
  },
});`,
      errors: ["The object type name foo should be PascalCase"],
      options: ["error", { autofix: true }],
    },
    {
      name: "Union type name is not PascalCase",
      code: `import { unionType } from "@nexus/schema";
const MediaType = unionType({
  name: "mediaType",
  description: "Any container type that can be rendered into the feed",
  definition(t) {
    t.members("Post", "Image", "Card");
    t.resolveType((item) => item.name);
  },
});`,
      output: `import { unionType } from "@nexus/schema";
const MediaType = unionType({
  name: "MediaType",
  description: "Any container type that can be rendered into the feed",
  definition(t) {
    t.members("Post", "Image", "Card");
    t.resolveType((item) => item.name);
  },
});`,
      errors: ["The union type name mediaType should be PascalCase"],
      options: ["error", { autofix: true }],
    },
    {
      name: "Scalar type name is not PascalCase",
      code: `import { scalarType } from "@nexus/schema";
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
      output: `import { scalarType } from "@nexus/schema";
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
      errors: ["The scalar type name date should be PascalCase"],
      options: ["error", { autofix: true }],
    },
    {
      name: "Interface type name is not PascalCase",
      code: `import { interfaceType } from "@nexus/schema";
const Node = interfaceType({
  name: "node",
  definition(t) {
    t.id("id", { description: "GUID for a resource" });
  },
});`,
      output: `import { interfaceType } from "@nexus/schema";
const Node = interfaceType({
  name: "Node",
  definition(t) {
    t.id("id", { description: "GUID for a resource" });
  },
});`,
      errors: ["The interface type name node should be PascalCase"],
      options: ["error", { autofix: true }],
    },
    {
      name: "Input type name is not PascalCase",
      code: `import { inputObjectType } from "@nexus/schema";
export const InputType = inputObjectType({
  name: "inputType",
  definition(t) {
    t.string("key", { required: true });
    t.int("answer");
  },
});`,
      output: `import { inputObjectType } from "@nexus/schema";
export const InputType = inputObjectType({
  name: "InputType",
  definition(t) {
    t.string("key", { required: true });
    t.int("answer");
  },
});`,
      errors: ["The input object type name inputType should be PascalCase"],
      options: ["error", { autofix: true }],
    },
    {
      name: "Enum type is not Pascal case",
      code: `import { enumType } from "@nexus/schema";
const Episode = enumType({
  name: "episode",
  members: ["NEWHOPE", "EMPIRE", "JEDI"],
  description: "The first Star Wars episodes released",
});`,
      output: `import { enumType } from "@nexus/schema";
const Episode = enumType({
  name: "Episode",
  members: ["NEWHOPE", "EMPIRE", "JEDI"],
  description: "The first Star Wars episodes released",
});`,
      errors: ["The enum type name episode should be PascalCase"],
      options: ["error", { autofix: true }],
    },
  ],
});
