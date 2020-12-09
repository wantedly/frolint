/* global NodeJS */

import { Command } from "clipanion";
import { accessSync, constants, writeFileSync } from "fs";
import { resolve } from "path";
import type { FrolintContext } from "../Context";
import { getGitRootDir } from "../utils/git";

export class ExportCommand extends Command<FrolintContext> {
  public static usage = Command.Usage({
    description: "export config files when the files are not exist",
  });

  @Command.Path("export")
  public async execute() {
    const log = this.context.debug("ExportCommand");

    log("Start to execute");

    const rootDir = getGitRootDir(this.context.cwd);
    const eslintrcPath = resolve(rootDir, ".eslintrc");

    try {
      log("Check ESLint config file existence");

      accessSync(eslintrcPath, constants.R_OK);

      log("ESLint config file found: %s", eslintrcPath);
    } catch (err) {
      log("ESLint config file not found");

      if (err && (err as NodeJS.ErrnoException).code === "ENOENT") {
        const eslintrcContent = `{
  "extends": ["wantedly-typescript"],
  "parserOptions": {
    "project": ["./tsconfig.json"]
  }
}`;

        log("Export ESLint config file");

        writeFileSync(eslintrcPath, eslintrcContent);
      }
    }

    const prettierrcPath = resolve(rootDir, ".prettierrc");

    try {
      log("Check Prettier config file existence");

      accessSync(prettierrcPath, constants.R_OK);

      log("Prettier config file found: %s", prettierrcPath);
    } catch (err) {
      log("Prettier config file not found");

      if (err && (err as NodeJS.ErrnoException).code === "ENOENT") {
        const prettierrcContent = `"prettier-config-wantedly"\n`;

        log("Export Prettier config file");

        writeFileSync(prettierrcPath, prettierrcContent);
      }
    }

    log("Execution finished");
  }
}
