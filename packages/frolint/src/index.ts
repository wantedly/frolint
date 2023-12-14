import { Cli } from "clipanion";
import { cosmiconfigSync } from "cosmiconfig";
import { DefaultCommand } from "./commands/DefaultCommand.js";
import { ExportCommand } from "./commands/ExportCommand.js";
import { HelpCommand } from "./commands/HelpCommand.js";
import { InstallCommand } from "./commands/InstallCommand.js";
import { PreCommitCommand } from "./commands/PreCommitCommand.js";
import { PrintConfigCommand } from "./commands/PrintConfigCommand.js";
import { UninstallCommand } from "./commands/UninstallCommand.js";
import { VersionCommand } from "./commands/VersionCommand.js";
import type { FrolintConfig, FrolintContext } from "./Context.js";
import { frolintDebug } from "./utils/debug.js";

const log = frolintDebug.extend("main");

const binaryName = "frolint";
const binaryVersion = "2.3.0";

log("CLI config: %o", { binaryName, binaryVersion });

const cli = Cli.from<FrolintContext>(
  [
    DefaultCommand,
    ExportCommand,
    HelpCommand,
    InstallCommand,
    PreCommitCommand,
    PrintConfigCommand,
    UninstallCommand,
    VersionCommand,
  ],
  {
    binaryLabel: "FROntend LINt Tool",
    binaryName,
    binaryVersion,
  }
);

log("Start to load config using cosmiconfig");

const result = cosmiconfigSync(binaryName).search();

let config: FrolintConfig = {
  typescript: true,
  eslint: {},
  prettier: {},
};

if (result && result.config) {
  config = {
    ...config,
    ...result.config,
  };
}

log("Frolint config: %o", config);
log("Start to run CLI");

void cli
  .runExit(process.argv.slice(2), {
    ...Cli.defaultContext,
    cwd: process.cwd(),
    config,
    preCommit: false,
    version: binaryVersion,
    debug: (namespace) => {
      return frolintDebug.extend(namespace);
    },
  })
  .then(() => {
    log("Linting and Formatting complete");
  });
