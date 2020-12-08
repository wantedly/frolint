import { Command } from "clipanion";
import type { FrolintContext } from "../Context";

export class VersionCommand extends Command<FrolintContext> {
  public static usage = Command.Usage({
    description: "print version",
  });

  @Command.Path("-v")
  @Command.Path("--version")
  public async execute() {
    this.context.stdout.write(`${this.context.version}\n`);
  }
}
