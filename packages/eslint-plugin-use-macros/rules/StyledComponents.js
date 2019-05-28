const createUseMacro = require("../createUseMacro");

module.exports = {
  meta: {
    type: "suggestion",
    fixable: "code",
  },
  create(context) {
    return {
      ImportDeclaration: createUseMacro("styled-components", "styled-components/macro", context),
    };
  },
};
