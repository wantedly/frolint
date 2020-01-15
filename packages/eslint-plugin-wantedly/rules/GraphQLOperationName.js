const { pascalCase } = require("pascal-case");

let GRAPHQL_INSTALLED = false;

try {
  require.resolve("graphql");
  GRAPHQL_INSTALLED = true;
} catch (_err) {
  GRAPHQL_INSTALLED = false;
}

module.exports = {
  meta: {
    type: "suggestion",
  },
  create(context) {
    if (!GRAPHQL_INSTALLED) {
      return {};
    }

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

        const chunks = [];

        const invalid = node.quasi.quasis.some((elem, i) => {
          const chunk = elem.value.cooked;
          const value = node.quasi.expressions[i];

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
              message: "Use PascalCase for operation name: {{ operationName }} -> {{ pascalCased }}",
              data: {
                operationName,
                pascalCased,
              },
            });
          },
        });
      },
    };
  },
};
