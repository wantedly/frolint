const { pascalCase } = require("pascal-case");
const { Linter } = require("eslint");
const { getAutofixEnabledFromContext } = require("./utils");

const linter = new Linter();
const RULE_NAME = "graphql-operation-name";

let GRAPHQL_INSTALLED = false;

try {
  require.resolve("graphql");
  GRAPHQL_INSTALLED = true;
} catch (_err) {
  GRAPHQL_INSTALLED = false;
}

linter.defineRule(RULE_NAME, {
  meta: {
    type: "suggestion",
    fixable: "code",
  },
  create(context) {
    if (!GRAPHQL_INSTALLED) {
      return {};
    }

    const autofixEnabled = getAutofixEnabledFromContext(context, RULE_NAME);
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

            context.report({
              node,
              message: "The operation name {{ operationName }} should be PascalCase",
              data: {
                operationName,
              },
              fix(fixer) {
                if (autofixEnabled) {
                  const nameLocation = operationDefinition.name.loc;
                  const [start] = node.quasi.range;
                  const errorRange = [
                    start + nameLocation.start + 1,
                    start + nameLocation.start + operationName.length + 1,
                  ];

                  return fixer.replaceTextRange(errorRange, pascalCased);
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
