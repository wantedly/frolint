const ogh = require("@yamadayuki/ogh");
const execa = require("execa");
const eslint = require("eslint");
const fs = require("fs");
const path = require("path");
const chalk = require("chalk");

function getStagedFiles(cwd) {
  const { stdout } = execa.shellSync("git diff --cached --name-only --diff-filter=ACMRTUB", { cwd });

  return stdout.split("\n").filter(line => line.length > 0);
}

function getUnstagedFiles(cwd) {
  const { stdout } = execa.shellSync("git diff --name-only --diff-filter=ACMRTUB", { cwd });

  return stdout.split("\n").filter(line => line.length > 0);
}

function isSupportedExtension(file) {
  return /(jsx?|tsx?)$/.test(file);
}

function stageFile(file, cwd) {
  execa.shellSync(`git add ${file}`, { cwd });
}

function getRelativePath(cwd, absolutePath) {
  if (absolutePath.startsWith(cwd)) {
    return path.relative(cwd, absolutePath);
  }

  return absolutePath;
}

function applyEslint(args, files) {
  const rootDir = ogh.extractGitRootDirFromArgs(args);

  const cli = new eslint.CLIEngine({
    baseConfig: {
      extends: ["wantedly"],
    },
    fix: true,
    cwd: rootDir,
  });

  return cli.executeOnFiles(files.filter(isSupportedExtension));
}

function reportNoop() {
  console.log(chalk.green("No errors and warnings!"));
}

function formatResults(results, cwd) {
  return results
    .filter(({ errorCount, warningCount }) => errorCount > 0 || warningCount > 0)
    .map(({ filePath, ...rest }) => {
      return {
        filePath: getRelativePath(cwd, filePath),
        ...rest,
      };
    });
}

function reportToConsole(report, cwd) {
  const { results, errorCount, warningCount } = report;

  if (errorCount === 0 && warningCount === 0) {
    reportNoop();
  } else {
    const reported = formatResults(results, cwd);
    reported.forEach(r => {
      console.log(r);
    });
  }
}

function preCommitHook(args, _config) {
  const rootDir = ogh.extractGitRootDirFromArgs(args);
  const staged = getStagedFiles(rootDir);
  const unstaged = getUnstagedFiles(rootDir);
  const files = Array.from(new Set([...staged, ...unstaged]));

  const isFullyStaged = file => {
    return !unstaged.includes(getRelativePath(rootDir, file));
  };

  const report = applyEslint(args, files);

  reportToConsole(report, rootDir);

  const results = formatResults(report.results, rootDir);

  results.forEach(result => {
    const { filePath, output } = result;
    if (output) {
      fs.writeFileSync(filePath, output);

      if (isFullyStaged(filePath)) {
        stageFile(args, filePath);
      }
    }
  });
}

module.exports = {
  preCommitHook,
};
