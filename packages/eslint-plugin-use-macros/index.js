const GraphQLTag = require("./rules/GraphQLTag");
const StyledComponents = require("./rules/StyledComponents");

/** @type {import('eslint').ESLint.Plugin } */
module.exports = {
  meta: {
    name: "eslint-plugin-use-macros",
  },
  rules: {
    "graphql-tag": GraphQLTag,
    "styled-components": StyledComponents,
  },
};
