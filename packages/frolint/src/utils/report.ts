import chalk from "chalk";
import type { CLIEngine } from "eslint";
import { relative } from "path";
import { frolintDebug } from "./debug";
import { getCLI } from "./eslint";

const { green, red, yellow } = chalk;
const log = frolintDebug.extend("report");

function reportNoop() {
  console.log(green("No errors and warnings!"));
}

function reportWithFrolintFormat(report: CLIEngine.LintReport, rootDir: string) {
  log("Start reporting using frolint format");
  const { results, errorCount, warningCount } = report;

  if (errorCount === 0 && warningCount === 0) {
    log("No errors and warnings");
    reportNoop();
    return [];
  }

  log("Some errors and warnings found: %o", { errorCount, warningCount });
  const total = `Detected ${red(errorCount.toString(), errorCount === 1 ? "error" : "errors")}, ${yellow(
    warningCount.toString(),
    warningCount === 1 ? "warning" : "warnings"
  )}`;
  console.log(total);

  const reported = formatResults(results, rootDir);
  reported.forEach(({ filePath, errorCount, warningCount, messages }) => {
    log("Start printing report for %s", filePath);

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
  log("Format ESLint error results");

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
    log("Start reporting using ESLint provided format: %o", { formatter });

    const cli = getCLI(rootDir);
    const format = cli.getFormatter(formatter);

    console.log(format(report.results));

    return formatResults(report.results, rootDir);
  }

  return reportWithFrolintFormat(report, rootDir);
}
