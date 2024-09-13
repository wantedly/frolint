import chalk from "chalk";
import { Command } from "clipanion";
import { writeFileSync } from "fs";
import { relative, resolve } from "path";
import type { FrolintContext } from "../Context";
import { applyEslint } from "../utils/eslint";
import {
  getAllFiles,
  getChangedFilesFromBranch,
  getGitRootDir,
  getStagedFiles,
  getUnstagedFiles,
  hasChangedFiles,
  isGitExist,
  isInsideGitRepository,
  stageFiles,
} from "../utils/git";
import { applyPrettier } from "../utils/prettier";
import { reportToConsole } from "../utils/report";

export class DefaultCommand extends Command<FrolintContext> {
  public static usage = Command.Usage({
    description: "apply ESLint and Prettier",
    details: `
      Apply ESLint and Prettier. It infers the affected files which are changed from base branch using git.

      ${chalk.bold("Options:")}

      --typescript: Use @typescript-eslint/parser as ESLint parser
      -b,--branch <branch name>: Find the changed files from the specified branch
      --expect-no-diff: Fail when the changed files exist
      --expect-no-errors: Fail out on the error instead of tolerating it (previously --bail option)
      -f,--formatter <format>: Print the report with specified format
      --no-stage: Do not stage the files which have the changes made by ESLint and Prettier auto fix functionality
    `,
    examples: [
      ["Default usage", "yarn frolint"],
      ["Diff with the specified branch", "yarn frolint --branch master"],
      ["Print report as stylish", "yarn frolint --formatter stylish"],
      [
        "Use with reviewdog",
        'yarn frolint --formatter checkstyle | reviewdog -f=checkstyle -name="lint" -reporter=github-pr-review',
      ],
    ],
  });

  @Command.Boolean("--typescript")
  private typescript = true;

  @Command.String("-b,--branch")
  private branch?: string;

  @Command.Boolean("--expect-no-diff")
  private expectNoDiff = false;

  @Command.Boolean("--expect-no-errors,--bail")
  private expectNoErrors = false;

  @Command.String("-f,--formatter")
  private formatter?: string;

  @Command.Boolean("--no-stage")
  private noStage = false;

  @Command.Boolean("--no-git", { hidden: true })
  private noGit = false;

  @Command.Path()
  public async execute(): Promise<number> {
    const log = this.context.debug("DefaultCommand");

    log("Start to execute");

    const rootDir = getGitRootDir(this.context.cwd);
    const isTypeScript = this.context.config.typescript ?? this.typescript;
    const noGit = this.noGit || !isGitExist() || !isInsideGitRepository();

    log("Command context: %o", { rootDir, isTypeScript, noGit });

    let files: string[] = [];
    let isFullyStaged = (_file: string) => true;

    if (noGit) {
      log("Running no git situation");

      files = getAllFiles(isTypeScript, rootDir);
    } else if (this.context.preCommit) {
      log("Running pre-commit situation");

      const staged = getStagedFiles(rootDir);
      const unstaged = getUnstagedFiles(rootDir);
      files = files.concat(Array.from(new Set([...staged, ...unstaged])));
      isFullyStaged = (file) => {
        const relativeFilepath = relative(rootDir, file);
        return files.includes(relativeFilepath) && !unstaged.includes(relativeFilepath);
      };
    } else if (this.branch) {
      log("Running branch specified situation");

      files = getChangedFilesFromBranch(this.branch, rootDir);
    } else {
      log("Running all files situation");

      files = getAllFiles(isTypeScript, rootDir);
    }

    log("Target Files: %O", files);

    const eslintConfigPackage = isTypeScript ? "eslint-config-wantedly-typescript" : "eslint-config-wantedly";

    log("ESLint Config: %o", { eslintConfigPackage });

    /**
     * Resolve package.json from eslintConfigPackage
     * node_modules/frolint/lib/commands -> node_modules/`eslintConfigPackage`/package.json
     *
     * node_modules/
     *   frolint/
     *     lib/
     *       commands/ <-- __dirname
     *   `eslintConfigPackage`/
     *     package.json
     */
    const pkg = require(resolve(__dirname, "..", "..", "..", eslintConfigPackage, "package.json"));
    Object.keys(pkg.dependencies).forEach((key) => {
      module.paths.push(resolve(__dirname, "..", "..", "..", key, "node_modules"));
    });

    const shouldStageFiles = new Set<string>();

    log("Start applying ESLint");
    /**
     * Apply ESLint step
     */
    const results = await applyEslint(rootDir, files);
    results.forEach((result) => {
      const { filePath, output } = result;
      if (output) {
        log("File (%s) has changed. Overwriting..", filePath);
        writeFileSync(filePath, output);

        if (!this.noStage && isFullyStaged(filePath)) {
          log("File (%s) should be staged", filePath);
          shouldStageFiles.add(relative(rootDir, filePath));
        }
      }
    });

    log("Start applying Prettier");
    /**
     * Apply Prettier step
     */
    const prettierResults = applyPrettier(rootDir, files, this.context.config.prettier);
    prettierResults
      .filter(
        (
          result: { filePath: string; output: string } | null
        ): result is Required<{
          filePath: string;
          output: string;
        }> => Boolean(result)
      )
      .forEach(({ filePath, output }) => {
        if (output) {
          log("File (%s) has changed. Overwriting..", filePath);
          writeFileSync(filePath, output);

          if (!this.noStage && isFullyStaged(filePath)) {
            log("File (%s) should be staged", filePath);
            shouldStageFiles.add(relative(rootDir, filePath));
          }
        }
      });

    log("Start stagings files");
    /**
     * Stage files step
     */
    if (!noGit) {
      stageFiles([...shouldStageFiles], rootDir);
    }

    log("Start reporting results to console");
    const reported = await reportToConsole(results, rootDir, this.context.config.formatter || this.formatter);

    if (!noGit && this.context.preCommit) {
      const stagedErrorCount = reported
        .filter(({ filePath }) => isFullyStaged(filePath))
        .reduce((acc, { errorCount }) => acc + errorCount, 0);

      if (stagedErrorCount > 0) {
        log("Exit CLI with non-zero status because the error remaining in staged files: %o", { stagedErrorCount });
        console.log("commit canceled with exit status 1. You have to fix ESLint errors.");
        return 1;
      }
    }

    if (this.expectNoErrors) {
      const errors = reported.reduce((acc, { errorCount }) => acc + errorCount, 0);
      if (errors > 0) {
        log("Exit CLI with non-zero status because the errors exist but you expected no errors: %o", {
          errors,
        });
        return 1;
      }
    }

    if (this.expectNoDiff && hasChangedFiles(this.context.cwd)) {
      log("Exit CLI with non-zero status because the files are changed");
      console.log(chalk.red(`You specified \`--expect-no-diff\` option but you have some changed files.`));

      return 1;
    }

    log("Execution finished");
    return 0;
  }
}
