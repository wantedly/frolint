// @ts-check

/**
 * @param {*} context
 * @param {Record<string, any>} defaultOption
 * @returns {Record<string, any>}
 */
function getOptionWithDefault(context, defaultOption) {
  return context.options.reduce((acc, obj) => ({ ...acc, ...obj }), defaultOption);
}

/**
 * @param {string} ruleName
 * @returns {string}
 */
function docsUrl(ruleName) {
  return `https://github.com/wantedly/frolint/tree/master/packages/eslint-plugin-wantedly/docs/rules/${ruleName}.md`;
}

module.exports = {
  getOptionWithDefault,
  docsUrl,
};
