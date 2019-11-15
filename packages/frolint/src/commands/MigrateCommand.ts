import { Command } from "clipanion";
import { FrolintContext } from "../Context";
import { HOOKS_CATEGORY } from "../utils/constants";

export class MigrateCommand extends Command<FrolintContext> {
  public static usage = Command.Usage({
    category: HOOKS_CATEGORY,
    description: "migrate git pre-commit hook for frolint",
    details: `
      This command will migrate the pre-commit hook script in .git/hooks/pre-commit from past version of frolint.
    `,
  });

  @Command.Path("migrate")
  public async execute() {
    await this.cli.run(["uninstall"], this.context);
    return await this.cli.run(["install"], this.context);
  }
}
