module.exports = function createUseMacro(from, to, context) {
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
      require.resolve(from);
      require.resolve(to);
      return true;
    } catch (_err) {
      return false;
    }
  }

  return function(node) {
    if (!checkBabelPluginMacroInstalled()) {
      context.report({
        node,
        message: "Please install 'babel-plugin-macro' to use macro",
      });
      return;
    }

    const importName = node.source.value.trim();

    if (importName === from) {
      if (!checkPackageExists()) {
        context.report({
          node,
          message: "Please install {{to}} to use macro",
          data: {
            to,
          },
        });
        return;
      }

      const [start, end] = node.source.range;
      context.report({
        node,
        message: 'Please import from "{{to}}" instead of "{{from}}"',
        data: { from, to },
        fix(fixer) {
          return fixer.replaceTextRange([start + 1, end - 1], to);
        },
      });
    }
  };
};
