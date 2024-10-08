import type { Rule } from "eslint";
import type { Property } from "estree";
import { pascalCase } from "pascal-case";
import { snakeCase } from "snake-case";

import { docsUrl, getOptionWithDefault, isNexusSchemaImported } from "./utils";

export const RULE_NAME = "nexus-pascal-case-type-name";

const FUNCTION_WHITELIST = ["objectType", "unionType", "scalarType", "interfaceType", "inputObjectType", "enumType"];

// Represents the default option and schema for nexus-pascal-case-type-name option
const DEFAULT_OPTION = {
  autofix: false,
};

export const RULE: Rule.RuleModule = {
  meta: {
    type: "suggestion",
    fixable: "code",
    schema: [
      {
        type: "object",
        properties: {
          autofix: {
            type: "boolean",
          },
        },
        additionalProperties: false,
      },
    ],
    docs: {
      url: docsUrl(RULE_NAME),
    },
  },
  create(context) {
    let isNexusUsed = false;
    const option = getOptionWithDefault(context, DEFAULT_OPTION);
    const autofixEnabled = option.autofix;

    return {
      ImportDeclaration(importDeclaration) {
        if (isNexusSchemaImported(importDeclaration)) {
          isNexusUsed = true;
        } else {
          return;
        }
      },

      CallExpression(callExpression) {
        if (!isNexusUsed) return;
        if (callExpression.type !== "CallExpression") return;
        if (callExpression.callee.type !== "Identifier") return;

        const functionName = callExpression.callee.name;
        if (!FUNCTION_WHITELIST.includes(functionName)) return;

        const argumentDef = callExpression.arguments[0];
        if (argumentDef.type !== "ObjectExpression") return;

        const targetNode = argumentDef.properties.find(
          (property): property is Property =>
            property.type === "Property" && property.key.type === "Identifier" && property.key.name === "name"
        )?.value;
        if (!targetNode) return;
        if (targetNode.type !== "Literal") return;

        const typeName = targetNode.value as string;
        const pascalCased = pascalCase(typeName);

        if (!typeName || !pascalCased || typeName === pascalCased) return;

        const [start, end] = targetNode.range ?? [0, 0];
        return context.report({
          node: targetNode,
          message: "The {{ functionName }} name {{ typeName }} should be PascalCase",
          data: {
            functionName: snakeCase(functionName).replace(/_/g, " "),
            typeName,
          },
          fix(fixer) {
            if (autofixEnabled) {
              return fixer.replaceTextRange([start + 1, end - 1], pascalCased);
            }
            return null;
          },
        });
      },
    };
  },
};
