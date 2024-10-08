import { Cli } from "clipanion";
import { cosmiconfigSync } from "cosmiconfig";

import type { FrolintConfig, FrolintContext } from "./Context";
import { DefaultCommand } from "./commands/DefaultCommand";
import { ExportCommand } from "./commands/ExportCommand";
import { HelpCommand } from "./commands/HelpCommand";
import { InstallCommand } from "./commands/InstallCommand";
import { PreCommitCommand } from "./commands/PreCommitCommand";
import { PrintConfigCommand } from "./commands/PrintConfigCommand";
import { UninstallCommand } from "./commands/UninstallCommand";
import { VersionCommand } from "./commands/VersionCommand";
import { frolintDebug } from "./utils/debug";

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
