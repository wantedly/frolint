import { Command } from "clipanion";
import { writeFileSync } from "fs";
import { relative, resolve } from "path";
import { FrolintContext } from "../Context";
import { applyEslint } from "../utils/eslint";
import {
  getAllFiles,
  getChangedFilesFromBranch,
  getGitRootDir,
  getStagedFiles,
  getUnstagedFiles,
  isGitExist,
  isInsideGitRepository,
  stageFiles,
} from "../utils/git";
import { applyPrettier } from "../utils/prettier";
import { reportToConsole } from "../utils/report";

export class DefaultCommand extends Command<FrolintContext> {
  public static usage = Command.Usage({
    description: "apply ESLint and Prettier",
  });

  @Command.Boolean("--typescript")
  private typescript = true;

  @Command.String("-b,--branch")
  private branch?: string;

  @Command.String("-f,--formatter")
  private formatter?: string;

  @Command.Boolean("--no-stage")
  private noStage = false;

  @Command.Boolean("--no-git")
  private noGit = false;

  @Command.Path()
  public async execute() {
    const rootDir = getGitRootDir(this.context.cwd);
    const isTypeScript = this.context.config.typescript || this.typescript;
    const noGit = this.noGit || !isGitExist() || !isInsideGitRepository();

    let files: string[] = [];
    let isFullyStaged = (_file: string) => true;

    if (noGit) {
      files = getAllFiles(isTypeScript, rootDir);
    } else if (this.context.preCommit) {
      const staged = getStagedFiles(rootDir);
      const unstaged = getUnstagedFiles(rootDir);
      files = files.concat(Array.from(new Set([...staged, ...unstaged])));
      isFullyStaged = file => {
        const relativeFilepath = relative(rootDir, file);
        return files.includes(relativeFilepath) && !unstaged.includes(relativeFilepath);
      };
    } else if (this.branch) {
      files = getChangedFilesFromBranch(this.branch, rootDir);
    } else {
      files = getAllFiles(isTypeScript, rootDir);
    }

    const eslintConfigPackage = isTypeScript ? "eslint-config-wantedly-typescript" : "eslint-config-wantedly";

    /**
     * Resolve package.json from eslintConfigPackage
     * node_modules/frolint/lib/commands -> node_modules/`eslintConfigPackage`/package.json
     *
     * node_modules/
     *   frolint/
     *     lib/
     *       commands/ <-- __dirname
     *   `eslintConfigPckage`/
     *     package.json
     */
    const pkg = require(resolve(__dirname, "..", "..", "..", eslintConfigPackage, "package.json"));
    Object.keys(pkg.dependencies).forEach(key => {
      module.paths.push(resolve(__dirname, "..", "..", "..", key, "node_modules"));
    });

    const shouldStageFiles = new Set<string>();

    /**
     * Apply ESLint step
     */
    const report = applyEslint(rootDir, files, eslintConfigPackage, this.context.config.eslint);
    report.results.forEach(result => {
      const { filePath, output } = result;
      if (output) {
        writeFileSync(filePath, output);

        if (!this.noStage && isFullyStaged(filePath)) {
          shouldStageFiles.add(relative(rootDir, filePath));
        }
      }
    });

    /**
     * Apply Prettier step
     */
    const results = applyPrettier(rootDir, files, this.context.config.prettier);
    results
      .filter((result: { filePath: string; output: string } | null): result is Required<{
        filePath: string;
        output: string;
      }> => Boolean(result))
      .forEach(({ filePath, output }) => {
        if (output) {
          writeFileSync(filePath, output);

          if (!this.noStage && isFullyStaged(filePath)) {
            shouldStageFiles.add(relative(rootDir, filePath));
          }
        }
      });

    /**
     * Stage files step
     */
    if (!noGit) {
      stageFiles([...shouldStageFiles], rootDir);
    }

    const reported = reportToConsole(report, rootDir, this.context.config.formatter || this.formatter);

    if (!noGit && this.context.preCommit) {
      const stagedErrorCount = reported
        .filter(({ filePath }) => isFullyStaged(filePath))
        .reduce((acc: number, { errorCount }) => acc + errorCount, 0);

      if (stagedErrorCount > 0) {
        console.log("commit canceled with exit status 1. You have to fix ESLint errors.");
        return 1;
      }
    }
  }
}