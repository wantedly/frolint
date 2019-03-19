const ogh = require("@yamadayuki/ogh");
const { green, red, yellow } = require("chalk");
const eslint = require("eslint");
const path = require("path");

function isSupportedExtension(file) {
  return /(jsx?|tsx?)$/.test(file);
}

function getRelativePath(cwd, absolutePath) {
  if (absolutePath.startsWith(cwd)) {
    return path.relative(cwd, absolutePath);
  }

  return absolutePath;
}

function getCli(cwd) {
  const cli = new eslint.CLIEngine({
    baseConfig: {
      extends: ["wantedly"],
    },
    fix: true,
    cwd,
  });

  return cli;
}

function applyEslint(args, files) {
  const rootDir = ogh.extractGitRootDirFromArgs(args);

  return getCli(rootDir).executeOnFiles(files.filter(isSupportedExtension));
}

function reportNoop() {
  console.log(green("No errors and warnings!"));
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

function reportWithFrolintFormat(report, cwd) {
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

function reportToConsole(report, cwd, formatter) {
  if (formatter) {
    const cli = getCli(cwd);
    const format = cli.getFormatter(formatter);

    console.log(format(report.results));

    return formatResults(report.results, cwd);
  }

  return reportWithFrolintFormat(report, cwd);
}

module.exports = {
  isSupportedExtension,
  getRelativePath,
  getCli,
  applyEslint,
  reportToConsole,
};
