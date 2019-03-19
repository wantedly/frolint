const ogh = require("@yamadayuki/ogh");
const execa = require("execa");
const path = require("path");
const { applyEslint, reportToConsole } = require("./base");
const { optionsFromConfig } = require("./config");
const { parseNoGitArgs } = require("./parseArgs");

function getAllFiles(cwd) {
  try {
    const { stdout } = execa.shellSync(`find -E ${cwd} -regex ".*\\.(js|jsx|ts|tsx)" | grep -v node_modules`, { cwd });

    return stdout.split("\n").filter(line => line.length > 0);
  } catch (_err) {
    return [];
  }
}

function noGitImplementation(args, config) {
  // extractGitRootDirFromArgs doesn't use git command
  const rootDir = ogh.extractGitRootDirFromArgs(args);
  const argResult = parseNoGitArgs(args);
  const { isTypescript, formatter } = optionsFromConfig(config);

  let files = [];

  if (argResult.files) {
    files = argResult.files;
  } else {
    files = getAllFiles(rootDir);
  }

  const eslintConfigPackage = isTypescript ? "eslint-config-wantedly-typescript" : "eslint-config-wantedly";

  // Enable to resolve the eslint-config-wantedly packages
  const eslintConfigWantedlyPkg = require(path.resolve(__dirname, "..", eslintConfigPackage, "package.json"));
  Object.keys(eslintConfigWantedlyPkg.dependencies).forEach(key => {
    module.paths.push(path.resolve(__dirname, "..", key, "node_modules"));
  });

  const report = applyEslint(args, files);
  reportToConsole(report, rootDir, argResult.formatter || formatter);
}

module.exports = {
  noGitImplementation,
};
