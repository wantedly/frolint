import { execSync } from "child_process";
import { sync as commandExistsSync } from "command-exists";
import { CLIEngine } from "eslint";
import { readFileSync } from "fs";
import { extname, resolve, relative } from "path";
import prettier, { BuiltInParserName } from "prettier";
import prettierConfigWantedly from "prettier-config-wantedly";
import { sync } from "resolve";
import { FrolintConfig } from "./Context";
import chalk from "chalk";

export const START_COMMENT = "# DO NOT EDIT frolint START";
export const END_COMMENT = "# DO NOT EDIT frolint END";

const { green, red, yellow } = chalk;

export function isInsideGitRepository(cwd?: string) {
  try {
    return Boolean(
      execSync("git rev-parse --is-inside-work-tree", { cwd })
        .toString()
        .trim()
    );
  } catch (err) {
    return false;
  }
}

export function isGitExist() {
  return commandExistsSync("git");
}

export function getPreCommitHookPath(): string {
  return resolve(
    execSync("git rev-parse --git-path hooks")
      .toString()
      .trimRight(),
    "pre-commit"
  );
}

export function isPreCommitHookInstalled() {
  try {
    const data = readFileSync(getPreCommitHookPath(), "utf8");
    return data.indexOf(START_COMMENT) !== -1 && data.indexOf(END_COMMENT) !== -1;
  } catch (_) {
    return false;
  }
}

export function getGitRootDir(cwd: string) {
  if (!isGitExist()) {
    return cwd;
  }

  try {
    return resolve(
      cwd,
      execSync("git rev-parse --show-cdup")
        .toString()
        .trimRight()
    );
  } catch (err) {
    return cwd;
  }
}

// ESLint utilities

function detectReactVersion(basedir: string) {
  try {
    const reactPath = sync("react", { basedir });
    const react = require(reactPath);
    return react.version;
  } catch (e) {
    return null;
  }
}

function getCLI(
  rootDir: string,
  eslintConfigPackage = "eslint-config-wantedly-typescript",
  eslintConfig: FrolintConfig["eslint"] = {}
) {
  const reactVersion = detectReactVersion(rootDir);
  const isReact = !!reactVersion;
  const netEslintConfigPackage = eslintConfigPackage.replace("eslint-config-", "") + (isReact ? "" : "/without-react");
  const reactSettings = reactVersion
    ? {
        react: {
          version: reactVersion,
        },
      }
    : {};
  const cacheLocation = resolve(rootDir, "node_modules", ".frolintcache");

  const cli = new CLIEngine({
    baseConfig: { extends: [netEslintConfigPackage], settings: { ...reactSettings } },
    fix: true,
    cwd: rootDir,
    ignorePath: eslintConfig.ignorePath,
    cache: true,
    cacheLocation,
  });

  return cli;
}

function isSupportedExtension(file: string) {
  return /(jsx?|tsx?)$/.test(file);
}

export function applyEslint(
  rootDir: string,
  files: string[],
  eslintConfigPackage: string,
  eslintConfig: FrolintConfig["eslint"]
) {
  const cli = getCLI(rootDir, eslintConfigPackage, eslintConfig);
  return cli.executeOnFiles(files.filter(isSupportedExtension).filter(file => !cli.isPathIgnored(file)));
}

function reportNoop() {
  console.log(green("No errors and warnings!"));
}

function reportWithFrolintFormat(report: CLIEngine.LintReport, rootDir: string) {
  const { results, errorCount, warningCount } = report;

  if (errorCount === 0 && warningCount === 0) {
    reportNoop();
    return [];
  }

  const total = `Detected ${red(errorCount.toString(), errorCount === 1 ? "error" : "errors")}, ${yellow(
    warningCount.toString(),
    warningCount === 1 ? "warning" : "warnings"
  )}`;
  console.log(total);

  const reported = formatResults(results, rootDir);
  reported.forEach(({ filePath, errorCount, warningCount, messages }) => {
    const colored = `${green(["./", filePath].join(""))}: ${red(
      errorCount.toString(),
      errorCount === 1 ? "error" : "errors"
    )}, ${yellow(warningCount.toString(), warningCount === 1 ? "warning" : "warnings")} found.`;
    console.log(colored);

    messages.forEach(({ ruleId, message, line, column }) => {
      const coloredMessage = `  ./${filePath}:${line}:${column} ${message} (${ruleId})`;
      console.log(coloredMessage);
    });
  });

  return reported;
}

function formatResults(results: CLIEngine.LintResult[], rootDir: string) {
  return results
    .filter(({ errorCount, warningCount }) => errorCount > 0 || warningCount > 0)
    .map(({ filePath, ...rest }) => {
      return {
        filePath: relative(rootDir, filePath),
        ...rest,
      };
    });
}

export function reportToConsole(report: CLIEngine.LintReport, rootDir: string, formatter?: string) {
  if (formatter) {
    const cli = getCLI(rootDir);
    const format = cli.getFormatter(formatter);

    console.log(format(report.results));

    return formatResults(report.results, rootDir);
  }

  return reportWithFrolintFormat(report, rootDir);
}

// Prettier utilities

const supportedLanguages = [
  "JavaScript",
  "Flow",
  "JSX",
  "TypeScript",
  "JSON.stringify",
  "JSON",
  "JSON with Comments",
  "JSON5",
  "GraphQL",
];

const supportedExtensions = prettier
  .getSupportInfo()
  .languages.filter(lang => supportedLanguages.includes(lang.name))
  .reduce((acc, lang) => acc.concat(lang.extensions || []), [] as string[]);

function isPrettierSupported(file: string) {
  return supportedExtensions.includes(extname(file));
}

function getInferredParser(file: string, prettierConfig: FrolintConfig["prettier"] = {}): BuiltInParserName {
  return prettier.getFileInfo.sync(file, { ignorePath: prettierConfig.ignorePath }).inferredParser as BuiltInParserName;
}

function isIgnoredForPrettier(file: string, prettierConfig: FrolintConfig["prettier"] = {}) {
  return prettier.getFileInfo.sync(file, { ignorePath: prettierConfig.ignorePath }).ignored;
}

export function applyPrettier(rootDir: string, files: string[], prettierConfig: FrolintConfig["prettier"]) {
  return files
    .filter(file => isPrettierSupported(file))
    .filter(file => !isIgnoredForPrettier(file, prettierConfig))
    .map(file => {
      const filePath = resolve(rootDir, file);
      const options =
        prettierConfig && prettierConfig.config
          ? { config: resolve(rootDir, prettierConfig.config) }
          : prettierConfigWantedly;
      const prettierOption = prettier.resolveConfig.sync(filePath, options);

      if (!prettierOption) {
        return null;
      }

      const input = readFileSync(filePath, "utf8");
      const output = prettier.format(input, {
        parser: getInferredParser(filePath),
        ...prettierOption,
        filepath: filePath,
      });

      if (input === output) {
        return null;
      }

      return { filePath, output };
    })
    .filter(Boolean);
}
