const GraphQLOperationName = require("./rules/GraphQLOperationName");
const GraphQLPascalCaseTypeName = require("./rules/GraphQLPascalCaseTypeName");
const NexusCamelCaseFieldName = require("./rules/NexusCamelCaseFieldName");
const NexusPascalCaseTypeName = require("./rules/NexusPascalCaseTypeName");

module.exports = {
  rules: {
    [GraphQLOperationName.RULE_NAME]: GraphQLOperationName.RULE,
    [GraphQLPascalCaseTypeName.RULE_NAME]: GraphQLPascalCaseTypeName.RULE,
    [NexusCamelCaseFieldName.RULE_NAME]: NexusCamelCaseFieldName.RULE,
    [NexusPascalCaseTypeName.RULE_NAME]: NexusPascalCaseTypeName.RULE,
  },
};
