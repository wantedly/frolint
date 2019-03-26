const ogh = require("@yamadayuki/ogh");
const { green, red, yellow } = require("chalk");
const eslint = require("eslint");
const path = require("path");
const fs = require("fs");
const resolve = require("resolve");
const prettier = require("prettier");
const { optionsFromConfig } = require("./config");

const SAMPLE_PRETTIER_CONFIG_FILE = path.resolve(__dirname, ".prettierrc");

function isSupportedExtension(file) {
  return /(jsx?|tsx?)$/.test(file);
}

function getRelativePath(cwd, absolutePath) {
  if (absolutePath.startsWith(cwd)) {
    return path.relative(cwd, absolutePath);
  }

  return absolutePath;
}

function detectReactVersion(cwd) {
  try {
    const reactPath = resolve.sync("react", { basedir: cwd });
    const react = require(reactPath);
    return react.version;
  } catch (e) {
    return null;
  }
}

/**
 * ESLint utilities
 */

function getCli(cwd, eslintConfigPackage) {
  const reactVersion = detectReactVersion(cwd);
  const isReact = !!reactVersion;
  const netEslintConfigPackage = eslintConfigPackage.replace("eslint-config-", "") + (isReact ? "" : "/without-react");

  const reactSettings = reactVersion
    ? {
        react: {
          version: reactVersion,
        },
      }
    : {};

  const cli = new eslint.CLIEngine({
    baseConfig: {
      extends: [netEslintConfigPackage],
      settings: {
        ...reactSettings,
      },
    },
    fix: true,
    cwd,
  });

  return cli;
}

function applyEslint(args, files, eslintConfigPackage) {
  const rootDir = ogh.extractGitRootDirFromArgs(args);

  return getCli(rootDir, eslintConfigPackage).executeOnFiles(files.filter(isSupportedExtension));
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

/**
 * Prettier utilities
 */

const supportedExtensions = prettier
  .getSupportInfo()
  .languages.reduce((acc, lang) => acc.concat(lang.extensions || []), []);

function isPrettierSupported(file) {
  return supportedExtensions.includes(path.extname(file));
}

function getInferredParser(file) {
  return prettier.getFileInfo.sync(file).inferredParser;
}

function applyPrettier(args, config, files) {
  const rootDir = ogh.extractGitRootDirFromArgs(args);
  const { prettierConfig } = optionsFromConfig(config);

  return files
    .filter(file => isPrettierSupported(file))
    .map(file => {
      const filePath = path.resolve(rootDir, file);
      const prettierOption = prettier.resolveConfig.sync(filePath, {
        config:
          prettierConfig && prettierConfig.config
            ? path.resolve(rootDir, prettierConfig.config)
            : SAMPLE_PRETTIER_CONFIG_FILE,
      });

      if (!prettierOption) {
        return null;
      }

      const input = fs.readFileSync(filePath, "utf8");
      const output = prettier.format(input, {
        parser: getInferredParser(filePath),
        ...prettierOption,
        filePath,
      });

      return { filePath, output };
    })
    .filter(Boolean);
}

module.exports = {
  isSupportedExtension,
  getRelativePath,
  getCli,
  applyEslint,
  reportToConsole,
  applyPrettier,
};
