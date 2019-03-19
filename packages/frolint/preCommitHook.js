const ogh = require("@yamadayuki/ogh");

const { isInsideGitRepository } = require("./git");
const { parseArgs, printHelp, printNoGitHelp } = require("./parseArgs");
const { defaultImplementation } = require("./defaultImplementation");
const { noGitImplementation } = require("./noGitImplementation");

/**
 * @param {string[]} args process.argv
 * @param {...Froconf} config a config of froconf
 */
function hook(args, config) {
  const rootDir = ogh.extractGitRootDirFromArgs(args);
  const isGitRepo = isInsideGitRepository(rootDir);
  const argResult = parseArgs(args);

  if (argResult.help) {
    if (!isGitRepo || argResult.noGit) {
      printNoGitHelp();
    } else {
      printHelp();
    }

    return;
  }

  if (isGitRepo) {
    defaultImplementation(args, config);
  } else {
    noGitImplementation(args, config);
  }
}

module.exports = {
  hook,
};
