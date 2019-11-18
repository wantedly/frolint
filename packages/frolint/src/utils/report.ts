import chalk from "chalk";
import { CLIEngine } from "eslint";
import { relative } from "path";
import { getCLI } from "./eslint";

const { green, red, yellow } = chalk;

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
