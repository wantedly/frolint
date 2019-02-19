const ogh = require("@yamadayuki/ogh");
const execa = require("execa");
const eslint = require("eslint");
const fs = require("fs");
const path = require("path");
const chalk = require("chalk");

const { green, red, yellow } = chalk;

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
    return [];
  }

  const total = `Detected ${red(errorCount, errorCount === 1 ? "error" : "errors")}, ${yellow(
    warningCount,
    warningCount === 1 ? "warning" : "warnings"
  )}`;
  console.log(total);

  const reported = formatResults(results, cwd);
  reported.forEach(({ filePath, errorCount, warningCount, messages }) => {
    const colored = `${green(["./", filePath].join(""))}: ${red(
      errorCount,
      errorCount === 1 ? "error" : "errors"
    )}, ${yellow(warningCount, warningCount === 1 ? "warning" : "warnings")} found.`;
    console.log(colored);

    messages.forEach(({ ruleId, message, line, column }) => {
      const coloredMessage = `  ./${filePath}:${line}:${column} ${message} (${ruleId})`;
      console.log(coloredMessage);
    });
  });

  return reported;
}

function preCommitHook(args, _config) {
  const rootDir = ogh.extractGitRootDirFromArgs(args);
  const staged = getStagedFiles(rootDir);
  const unstaged = getUnstagedFiles(rootDir);
  const files = Array.from(new Set([...staged, ...unstaged]));

  // Enable to resolve the eslint-config-wantedly packages
  const eslintConfigWantedlyPkg = require(path.resolve(__dirname, "..", "eslint-config-wantedly", "package.json"));
  Object.keys(eslintConfigWantedlyPkg.dependencies).forEach(key => {
    module.paths.push(path.resolve(__dirname, "..", key, "node_modules"));
  });

  const isFullyStaged = file => {
    return !unstaged.includes(getRelativePath(rootDir, file));
  };

  const report = applyEslint(args, files);

  report.results.forEach(result => {
    const { filePath, output } = result;
    if (output) {
      fs.writeFileSync(filePath, output);

      if (isFullyStaged(filePath)) {
        stageFile(getRelativePath(rootDir, filePath), rootDir);
      }
    }
  });

  const reported = reportToConsole(report, rootDir);
  const stagedErrorCount = reported
    .filter(({ filePath }) => isFullyStaged(filePath))
    .reduce((acc, { errorCount }) => acc + errorCount, 0);

  if (stagedErrorCount > 0) {
    console.log("commit canceled with exit status 1. You have to fix ESLint errors.");
    process.exit(1);
  }
}

module.exports = {
  preCommitHook,
};
