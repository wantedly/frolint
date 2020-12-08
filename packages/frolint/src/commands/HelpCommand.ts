import { Command } from "clipanion";
import type { FrolintContext } from "../Context";
import { DefaultCommand } from "./DefaultCommand";

export class HelpCommand extends Command<FrolintContext> {
  @Command.Path("--help")
  @Command.Path("-h")
  public async execute() {
    this.context.stdout.write(this.cli.usage(null));
    this.context.stdout.write(this.cli.usage(DefaultCommand, { detailed: true }));
  }
}
