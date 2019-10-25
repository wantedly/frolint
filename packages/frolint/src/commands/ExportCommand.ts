import { Command } from "clipanion";
import { writeFileSync, accessSync, constants } from "fs";
import { resolve } from "path";
import { FrolintContext } from "../Context";
import { getGitRootDir } from "../utils/git";

export class ExportCommand extends Command<FrolintContext> {
  public static usage = Command.Usage({
    description: "export config files when the files are not exist",
  });

  @Command.Path("export")
  public async execute() {
    const rootDir = getGitRootDir(this.context.cwd);

    const eslintrcPath = resolve(rootDir, ".eslintrc");

    try {
      accessSync(eslintrcPath, constants.R_OK);
    } catch (err) {
      if (err && (err as NodeJS.ErrnoException).code === "ENOENT") {
        const eslintrcContent = `
        {
          "extends": ["wantedly-typescript"],
        }
        `;

        writeFileSync(eslintrcPath, eslintrcContent);
      }
    }

    const prettierrcPath = resolve(rootDir, ".prettierrc");

    try {
      accessSync(prettierrcPath, constants.R_OK);
    } catch (err) {
      if (err && (err as NodeJS.ErrnoException).code === "ENOENT") {
        const prettierrcContent = `"prettier-config-wantedly"\n`;

        writeFileSync(prettierrcPath, prettierrcContent);
      }
    }
  }
}
