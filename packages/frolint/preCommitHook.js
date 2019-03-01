const ogh = require("@yamadayuki/ogh");
const execa = require("execa");
const eslint = require("eslint");
const fs = require("fs");
const path = require("path");
const chalk = require("chalk");
const arg = require("arg");

const { green, red, yellow } = chalk;

function getStagedFiles(cwd) {
  const { stdout } = execa.shellSync("git diff --cached --name-only --diff-filter=ACMRTUB", { cwd });

  return stdout.split("\n").filter(line => line.length > 0);
}

function getUnstagedFiles(cwd) {
  const { stdout } = execa.shellSync("git diff --name-only --diff-filter=ACMRTUB", { cwd });

  return stdout.split("\n").filter(line => line.length > 0);
}

function getAllFiles(cwd, extensions) {
  const { stdout } = execa.shellSync(`git ls-files ${extensions.map(ext => `*${ext}`).join(" ")}`, { cwd });

  return stdout.split("\n").filter(line => line.length > 0);
}

function getFilesBetweenCurrentAndBranch(cwd, branch) {
  const { stdout: commitHash } = execa.shellSync(`git show-branch --merge-base ${branch} HEAD`, { cwd });
  const { stdout } = execa.shellSync(`git diff --name-only --diff-filter=ACMRTUB ${commitHash}`, { cwd });

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

function parseArgs(args) {
  const result = arg(
    {
      "--formatter": String,
      "--branch": String,
      "--no-stage": Boolean,
      "-v": "--formatter",
      "-b": "--branch",
    },
    { argv: args }
  );

  return {
    formatter: result["--formatter"],
    branch: result["--branch"],
    noStage: result["--no-stage"],
  };
}

/**
 * @param {string[]} args process.argv
 * @param {...Froconf} config a config of froconf
 */
function hook(args, config) {
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
      return !unstaged.includes(getRelativePath(rootDir, file));
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
  getStagedFiles,
  getUnstagedFiles,
  getAllFiles,
  hook,
};
