// @ts-check

/**
 * @param {*} context
 * @param {Record<string, any>} defaultOption
 * @returns {Record<string, any>}
 */
function getOptionWithDefault(context, defaultOption) {
  return context.options.reduce((acc, obj) => ({ ...acc, ...obj }), defaultOption);
}

module.exports = {
  getOptionWithDefault,
};
