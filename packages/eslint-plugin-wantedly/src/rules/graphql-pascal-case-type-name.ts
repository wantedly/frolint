import { Linter, Rule } from "eslint";
import type { TaggedTemplateExpression } from "estree";
import type {
  ASTNode,
  FragmentDefinitionNode,
  InterfaceTypeDefinitionNode,
  ObjectTypeDefinitionNode,
  VisitFn,
} from "graphql";
import type { EnterLeave } from "graphql/language/visitor";
import { pascalCase } from "pascal-case";
import { docsUrl, getOptionWithDefault } from "./utils";

const linter = new Linter();
export const RULE_NAME = "graphql-pascal-case-type-name";

let GRAPHQL_INSTALLED = false;

try {
  require.resolve("graphql");
  GRAPHQL_INSTALLED = true;
} catch (_err) {
  GRAPHQL_INSTALLED = false;
}

// Represents the default option and schema for graphql-pascal-case-type-name option
const DEFAULT_OPTION = {
  autofix: false,
};

function createGraphQLCapitalizeTypeRule<
  T extends InterfaceTypeDefinitionNode | ObjectTypeDefinitionNode | FragmentDefinitionNode
>({
  context,
  node,
  message,
  autofixEnabled,
}: {
  context: Rule.RuleContext;
  node: TaggedTemplateExpression;
  message: string;
  autofixEnabled: boolean;
}): VisitFn<ASTNode, T> | EnterLeave<VisitFn<ASTNode, T>> {
  return function visitor(definition) {
    const typeName = definition.name.value;
    const pascalCased = pascalCase(typeName);

    if (typeName === pascalCased) return;

    const nameLocation = definition.name.loc;
    const start = node.quasi.range?.[0];
    const errorStart = (start ?? 0) + (nameLocation?.start ?? 0) + 1;
    const errorEnd = (start ?? 0) + (nameLocation?.start ?? 0) + typeName.length + 1;
    const sourceCode = context.getSourceCode();
    const locStart = sourceCode.getLocFromIndex(errorStart);
    const locEnd = sourceCode.getLocFromIndex(errorEnd);

    return context.report({
      node,
      loc: { start: locStart, end: locEnd },
      message,
      data: {
        typeName,
      },
      fix(fixer) {
        if (autofixEnabled) {
          return fixer.replaceTextRange([errorStart, errorEnd], pascalCased);
        }
        return null;
      },
    });
  };
}

linter.defineRule(RULE_NAME, {
  meta: {
    type: "suggestion",
    fixable: "code",
    docs: {
      url: docsUrl(RULE_NAME),
    },
  },
  create(context) {
    if (!GRAPHQL_INSTALLED) {
      return {};
    }

    const option = getOptionWithDefault(context, DEFAULT_OPTION);
    const autofixEnabled = option.autofix;
    const graphql = require("graphql") as typeof import("graphql");

    return {
      TaggedTemplateExpression(node) {
        if (node.type !== "TaggedTemplateExpression") return;

        // We assume that the tag name is gql which is originated from 'graphql-tag' or 'graphql.macro'
        if (node.tag.type !== "Identifier" || node.tag.name !== "gql") return;

        if (!(node.quasi.quasis.length > 0)) return;

        const chunks: string[] = [];

        const invalid = node.quasi.quasis.some((elem, i) => {
          let chunk: string = elem.value.cooked;
          const value = node.quasi.expressions[i];

          /**
           * If the tagged template literal includes the interpolations,
           * we should preserve the interpolation position with whitespaces for the GraphQL token location.
           */
          if (value && value.type === "Identifier" && value.name && value.name.length > 0) {
            chunk = chunk.concat(" ".repeat(value.name.length + 3));
          }

          chunks.push(chunk);

          if (chunk.split("{").length !== chunk.split("}").length) {
            context.report({
              node: value,
              message: "Interpolation must occur outside of the brackets",
            });
            return true;
          }

          return false;
        });

        if (invalid) {
          return;
        }

        const cooked = chunks.join("");
        const parsed = graphql.parse(cooked);

        graphql.visit(parsed, {
          InterfaceTypeDefinition: createGraphQLCapitalizeTypeRule({
            context,
            node,
            autofixEnabled,
            message: "The interface type {{ typeName }} should be PascalCase",
          }),

          ObjectTypeDefinition: createGraphQLCapitalizeTypeRule({
            context,
            node,
            autofixEnabled,
            message: "The object type {{ typeName }} should be PascalCase",
          }),

          FragmentDefinition: createGraphQLCapitalizeTypeRule({
            context,
            node,
            autofixEnabled,
            message: "The fragment {{ typeName }} should be PascalCase",
          }),
        });
      },
    };
  },
});

export const RULE = linter.getRules().get(RULE_NAME) as Rule.RuleModule;
