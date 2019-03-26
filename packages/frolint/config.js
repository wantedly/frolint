/**
 * A config of frolint
 * @typedef {Object} Froconf
 * @property {boolean} typescript - Indicates whether the eslint config uses @typescript-eslint or not.
 * @property {string} [formatter] - Indicates the formatter for console
 * @property {Object} prettierConfig - Indicates the prettier option
 */

/**
 * @param {...Froconf} config a config of froconf
 */
function optionsFromConfig(config) {
  const { typescript, formatter, prettier } = config;

  return {
    isTypescript: typeof typescript === "boolean" ? typescript : true,
    formatter,
    prettierConfig: prettier,
  };
}

module.exports = {
  optionsFromConfig,
};
