const FROM = "graphql-tag";
const TO = "graphql.macro";

function checkBabelPluginMacroInstalled() {
  try {
    require.resolve("babel-plugin-macros");
    return true;
  } catch (_err) {
    return false;
  }
}

function checkPackageExists() {
  try {
    require.resolve(FROM);
    require.resolve(TO);
    return true;
  } catch (_err) {
    return false;
  }
}

module.exports = {
  meta: {
    type: "suggestion",
    fixable: "code",
  },
  create(context) {
    return {
      ImportDeclaration(node) {
        if (!checkBabelPluginMacroInstalled()) {
          context.report({
            node,
            message: 'Please install "babel-plugin-macro" to use macro',
          });
          return;
        }

        const importName = node.source.value.trim();

        if (importName === FROM) {
          if (!checkPackageExists()) {
            context.report({
              node,
              message: 'Please install "graphql.macro" to use macro',
            });
            return;
          }

          const specifier = node.specifiers[0];
          const [start, end] = node.source.range;
          context.report({
            node,
            message: 'Please import from "graphql.macro" instead of "graphql-tag"',
            fix(fixer) {
              return [
                fixer.replaceTextRange(specifier.range, "{ gql }"),
                fixer.replaceTextRange([start + 1, end - 1], TO),
              ];
            },
          });
        }
      },
    };
  },
};
