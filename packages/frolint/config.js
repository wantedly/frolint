/**
 * A config of frolint
 * @typedef {Object} Froconf
 * @property {boolean} typescript - Indicates whether the eslint config uses @typescript-eslint or not.
 * @property {string} [formatter] - Indicates the formatter for console
 */

/**
 * @param {...Froconf} config a config of froconf
 */
function optionsFromConfig(config) {
  const { typescript, formatter } = config;

  return {
    isTypescript: typeof typescript === "boolean" ? typescript : true,
    formatter,
  };
}

module.exports = {
  optionsFromConfig,
};
