const { pascalCase } = require("pascal-case");
const { Linter } = require("eslint");
const { getOptionWithDefault, docsUrl } = require("./utils");

const linter = new Linter();
const RULE_NAME = "nexus-pascal-case-type-name";

const FUNCTION_WHITELIST = ["objectType", "unionType", "scalarType", "interfaceType", "inputObjectType", "enumType"];

// Represents the default option and schema for graphql-operation-name option
const DEFAULT_OPTION = {
  autofix: false,
};

linter.defineRule(RULE_NAME, {
  meta: {
    type: "suggestion",
    fixable: "code",
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
        if (
          importDeclaration.source &&
          importDeclaration.source.type === "Literal" &&
          importDeclaration.source.value === "nexus"
        ) {
          isNexusUsed = true;
        }
      },

      CallExpression(callExpression) {
        if (!isNexusUsed) {
          return;
        }

        const functionName = callExpression.callee.name;
        let typeName;
        let pascalCased;
        let targetNode;

        if (FUNCTION_WHITELIST.includes(functionName)) {
          const argumentDef = callExpression.arguments[0];
          targetNode = argumentDef.properties.find(property => property.key.name === "name").value;
          // If the value is template literal string, this line raises error
          typeName = targetNode.value;
          pascalCased = pascalCase(typeName);
        }

        if (typeName && pascalCased && typeName !== pascalCased) {
          const [start, end] = targetNode.range;
          context.report({
            node: targetNode,
            message: "The {{ functionName }} name {{ typeName }} should be PascalCase",
            data: {
              functionName,
              typeName,
            },
            fix(fixer) {
              if (autofixEnabled) {
                return fixer.replaceTextRange([start + 1, end - 1], pascalCased);
              }
            },
          });
        }
      },
    };
  },
});

module.exports = {
  RULE_NAME,
  RULE: linter.getRules().get(RULE_NAME),
};
