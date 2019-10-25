import { Command } from "clipanion";
import { FrolintContext } from "../Context";
import { getGitRootDir, applyEslint, applyPrettier, reportToConsole } from "../utils";
import { execSync } from "child_process";
import { resolve, relative } from "path";
import { writeFileSync } from "fs";

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

  @Command.Path()
  public async execute() {
    const rootDir = getGitRootDir(this.context.cwd);
    const isTypeScript = this.context.config.typescript || this.typescript;

    let files: string[] = [];
    let isFullyStaged = (_file: string) => true;

    if (this.context.preCommit) {
      const staged = execSync("git diff --cached --name-only --diff-filter=ACMRTUB", { cwd: rootDir })
        .toString()
        .trim()
        .split("\n");
      const unstaged = execSync("git diff --name-only --diff-filter=ACMRTUB", { cwd: rootDir })
        .toString()
        .trim()
        .split("\n");
      files = files.concat(Array.from(new Set([...staged, ...unstaged])));
      isFullyStaged = file => {
        const relativeFilepath = relative(rootDir, file);
        return files.includes(relativeFilepath) && !unstaged.includes(relativeFilepath);
      };
    } else if (this.branch) {
      const commitHash = execSync(`git show-branch --merge-base ${this.branch} HEAD`, { cwd: rootDir })
        .toString()
        .trim();
      files = execSync(`git diff --name-only --diff-filter=ACMRTUB ${commitHash}`, { cwd: rootDir })
        .toString()
        .trim()
        .split("\n");
    } else {
      const extensions = (isTypeScript ? [".js", ".jsx", ".ts", ".tsx"] : [".js", ".jsx"])
        .map(ext => `"**/*${ext}"`)
        .join(" ");
      files = execSync(`git ls-files ${extensions}`, { cwd: rootDir })
        .toString()
        .trim()
        .split("\n");
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
    if (shouldStageFiles.size > 0) {
      execSync(`git add ${[...shouldStageFiles].join(" ")}`, { cwd: rootDir });
    }

    const reported = reportToConsole(report, rootDir, this.context.config.formatter || this.formatter);

    if (this.context.preCommit) {
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
