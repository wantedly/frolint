import { Command } from "clipanion";
import { FrolintContext } from "../Context";
import { gitExists, isInsideGitRepository } from "../utils";

export class InstallCommand extends Command<FrolintContext> {
  public static usage = Command.Usage({
    description: "install git pre-commit hook for frolint",
    details: `
      This command will insert the pre-commit hook script into .git/hooks/pre-commit. If there is no .git/hooks/pre-commit, this command will create the script file.
    `,
  });

  @Command.Path("install")
  public async execute() {
    if (!gitExists()) {
      return;
    }

    if (!isInsideGitRepository(this.context.cwd)) {
      return;
    }

    this.context.stdout.write("Install");
  }
}
