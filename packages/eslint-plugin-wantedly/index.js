const GraphQLOperationName = require("./rules/GraphQLOperationName");
const GraphQLPascalCaseTypeName = require("./rules/GraphQLPascalCaseTypeName");
const NexusPascalCaseTypeName = require("./rules/NexusPascalCaseTypeName");

module.exports = {
  rules: {
    [GraphQLOperationName.RULE_NAME]: GraphQLOperationName.RULE,
    [GraphQLPascalCaseTypeName.RULE_NAME]: GraphQLPascalCaseTypeName.RULE,
    [NexusPascalCaseTypeName.RULE_NAME]: NexusPascalCaseTypeName.RULE,
  },
};
