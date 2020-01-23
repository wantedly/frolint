// @ts-check

/**
 * @param {*} context
 * @param {string} ruleName
 * @returns {boolean}
 */
function getAutofixEnabledFromContext(context, ruleName) {
  return context.settings.wantedly && context.settings.wantedly.autofix
    ? context.settings.wantedly.autofix[ruleName]
    : false;
}

module.exports = {
  getAutofixEnabledFromContext,
};
