import { Cli } from "clipanion";
import { DefaultCommand, HelpCommand, InstallCommand, UninstallCommand } from "./commands";
import { FrolintContext } from "./Context";
const pkg = require("../package.json");

const cli = new Cli<FrolintContext>({
  binaryLabel: "FROntend LINt Tool",
  binaryName: "frolint",
  binaryVersion: pkg.version,
});

cli.register(DefaultCommand);
cli.register(HelpCommand);
cli.register(InstallCommand);
cli.register(UninstallCommand);

// eslint-disable-next-line @typescript-eslint/no-floating-promises
cli.runExit(process.argv.slice(2), {
  stdin: process.stdin,
  stdout: process.stdout,
  stderr: process.stderr,
  cwd: process.cwd(),
});
