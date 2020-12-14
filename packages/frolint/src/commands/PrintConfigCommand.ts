import { Command } from "clipanion";
import type { FrolintContext } from "../Context";
import { getCLI } from "../utils/eslint";

export class PrintConfigCommand extends Command<FrolintContext> {
  public static usage = Command.Usage({
    description: "Print the configuration for the given file",
  });

  @Command.String({ required: true })
  public filepath!: string;

  @Command.Path("print-config")
  public async execute() {
    const log = this.context.debug("PrintConfigCommand");

    log("Start to execute");
    log("Print config context: %o", {
      cwd: this.context.cwd,
      eslintConfig: this.context.config.eslint,
      filepath: this.filepath,
    });

    const config = await getCLI(this.context.cwd, undefined, this.context.config.eslint).calculateConfigForFile(
      this.filepath
    );
    console.log(JSON.stringify(config, null, "  "));

    log("Exection finished");
  }
}
