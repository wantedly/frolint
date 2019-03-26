const ogh = require("@yamadayuki/ogh");
const fs = require("fs");
const path = require("path");

const { getRelativePath, applyEslint, reportToConsole } = require("./base");
const { optionsFromConfig } = require("./config");
const { getStagedFiles, getUnstagedFiles, getAllFiles, getFilesBetweenCurrentAndBranch, stageFile } = require("./git");
const { parseArgs } = require("./parseArgs");

function defaultImplementation(args, config) {
  const rootDir = ogh.extractGitRootDirFromArgs(args);
  const argResult = parseArgs(args);
  const { isTypescript, formatter } = optionsFromConfig(config);
  const isPreCommit = ogh.extractHookFromArgs(args) === "pre-commit";

  let files = [];
  let isFullyStaged = _file => true;

  if (isPreCommit) {
    const staged = getStagedFiles(rootDir);
    const unstaged = getUnstagedFiles(rootDir);
    files = files.concat(Array.from(new Set([...staged, ...unstaged])));
    isFullyStaged = file => {
      const relativeFilepath = getRelativePath(rootDir, file);
      return files.includes(relativeFilepath) && !unstaged.includes(relativeFilepath);
    };
  } else if (argResult.branch) {
    files = getFilesBetweenCurrentAndBranch(rootDir, argResult.branch);
  } else {
    files = getAllFiles(rootDir, isTypescript ? [".js", ".jsx", ".ts", ".tsx"] : [".js", ".jsx"]);
  }

  const eslintConfigPackage = isTypescript ? "eslint-config-wantedly-typescript" : "eslint-config-wantedly";

  // Enable to resolve the eslint-config-wantedly packages
  const eslintConfigWantedlyPkg = require(path.resolve(__dirname, "..", eslintConfigPackage, "package.json"));
  Object.keys(eslintConfigWantedlyPkg.dependencies).forEach(key => {
    module.paths.push(path.resolve(__dirname, "..", key, "node_modules"));
  });

  const report = applyEslint(args, files, eslintConfigPackage);

  report.results.forEach(result => {
    const { filePath, output } = result;
    if (output) {
      fs.writeFileSync(filePath, output);

      if (!argResult.noStage && isFullyStaged(filePath)) {
        stageFile(getRelativePath(rootDir, filePath), rootDir);
      }
    }
  });

  const reported = reportToConsole(report, rootDir, argResult.formatter || formatter);

  if (isPreCommit) {
    const stagedErrorCount = reported
      .filter(({ filePath }) => isFullyStaged(filePath))
      .reduce((acc, { errorCount }) => acc + errorCount, 0);

    if (stagedErrorCount > 0) {
      console.log("commit canceled with exit status 1. You have to fix ESLint errors.");
      process.exit(1);
    }
  }
}

module.exports = {
  defaultImplementation,
};
