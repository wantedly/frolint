const GraphQLTag = require("./rules/GraphQLTag");
const StyledComponents = require("./rules/StyledComponents");

module.exports = {
  rules: {
    "graphql-tag": GraphQLTag,
    "styled-components": StyledComponents,
  },
};
