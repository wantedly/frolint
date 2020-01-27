const { pascalCase } = require("pascal-case");
const { Linter } = require("eslint");
const { getOptionWithDefault, docsUrl } = require("./utils");

const linter = new Linter();
const RULE_NAME = "graphql-operation-name";

let GRAPHQL_INSTALLED = false;

try {
  require.resolve("graphql");
  GRAPHQL_INSTALLED = true;
} catch (_err) {
  GRAPHQL_INSTALLED = false;
}

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
    if (!GRAPHQL_INSTALLED) {
      return {};
    }

    const option = getOptionWithDefault(context, DEFAULT_OPTION);
    const autofixEnabled = option.autofix;
    const graphql = require("graphql");

    return {
      TaggedTemplateExpression(node) {
        // We assume that the tag name is gql which is originated from 'graphql-tag' or 'graphql.macro'
        if (node.tag.type !== "Identifier" || node.tag.name !== "gql") {
          return;
        }

        if (!(node.quasi.quasis.length > 0)) {
          return;
        }

        /** @type {string[]} */
        const chunks = [];

        const invalid = node.quasi.quasis.some((elem, i) => {
          /** @type {string} */
          let chunk = elem.value.cooked;
          const value = node.quasi.expressions[i];

          /**
           * If the tagged template literal includes the interpolations,
           * we should preserve the interpolation position with whitespaces for the GraphQL token location.
           */
          if (value && value.name && value.name.length > 0) {
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
          OperationDefinition(operationDefinition) {
            /**
             * Check the operation name existence to forbid no name operation
             * - OK
             *   - query GetProject {  }
             *   - mutation UpdateProject {  }
             * - NG
             *   - query {  }
             *   - mutation {  }
             */
            if (!operationDefinition.name || operationDefinition.name.value === "") {
              context.report({
                node,
                message: "Specify the operation name for {{ operation }}",
                data: {
                  operation: operationDefinition.operation,
                },
              });
              return;
            }

            const operationName = operationDefinition.name.value;
            const pascalCased = pascalCase(operationName);

            if (operationName === pascalCased) {
              return;
            }

            const nameLocation = operationDefinition.name.loc;
            const [start] = node.quasi.range;
            const errorStart = start + nameLocation.start + 1;
            const errorEnd = start + nameLocation.start + operationName.length + 1;
            const sourceCode = context.getSourceCode();
            const locStart = sourceCode.getLocFromIndex(errorStart);
            const locEnd = sourceCode.getLocFromIndex(errorEnd);

            context.report({
              node,
              loc: { start: locStart, end: locEnd },
              message: "The operation name {{ operationName }} should be PascalCase",
              data: {
                operationName,
              },
              fix(fixer) {
                if (autofixEnabled) {
                  return fixer.replaceTextRange([errorStart, errorEnd], pascalCased);
                }
              },
            });
          },
        });
      },
    };
  },
});

module.exports = {
  RULE_NAME,
  RULE: linter.getRules().get(RULE_NAME),
};
