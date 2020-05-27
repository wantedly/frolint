import { Command } from "clipanion";
import { FrolintContext } from "../Context";
import { getCLI } from "../utils/eslint";

export class PrintConfigCommand extends Command<FrolintContext> {
  public static usage = Command.Usage({
    description: "Print the configuration for the given file",
  });

  @Command.String({ required: true })
  public filepath!: string;

  @Command.Path("print-config")
  public async execute() {
    const config = getCLI(this.context.cwd, undefined, this.context.config.eslint).getConfigForFile(this.filepath);
    console.log(JSON.stringify(config, null, "  "));
  }
}
