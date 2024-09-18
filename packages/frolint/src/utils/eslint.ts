import { ESLint } from "eslint";
import { resolve } from "path";
import { sync } from "resolve";
import { frolintDebug } from "./debug";

const log = frolintDebug.extend("eslint");

function detectReactVersion(basedir: string) {
  log("detect react version: basedir=%s", basedir);

  try {
    log("Resolve installed react package path");

    const reactPath = sync("react", { basedir });
    log("Resolved react package path: %s", reactPath);

    log("Require actual react");
    const react = require(reactPath);

    log("Resolved react package version: %s", react.version);
    return react.version;
  } catch (_e) {
    log("Cannot resolve react");
    return null;
  }
}

let cliInstance: ESLint | null = null;

export function getCLI(rootDir: string) {
  log("Retrieve ESLint CLI instance");

  if (cliInstance) {
    log("Cached CLI instance found");
    return cliInstance;
  }

  log("Cached CLI instance not found. Create new CLI instance");

  const reactVersion = detectReactVersion(rootDir);

  log("This project has react version %o", { reactVersion });

  log("Resolve proper ESLint config");

  const reactSettings = reactVersion
    ? {
        react: {
          version: reactVersion,
        },
      }
    : {};
  const cacheLocation = resolve(rootDir, "node_modules", ".frolintcache");

  const options: ESLint.Options = {
    baseConfig: {
      name: "frolint",
      settings: {
        ...reactSettings,
      },
    },
    fix: true,
    cwd: rootDir,
    cache: true,
    cacheLocation,
  };

  log("Create CLI instance with options: %O", options);

  cliInstance = new ESLint(options);

  return cliInstance;
}

function isSupportedExtension(file: string) {
  return /(jsx?|tsx?)$/.test(file);
}

export async function applyEslint(rootDir: string, files: string[]) {
  const cli = getCLI(rootDir);
  const targetFiles = files.filter(isSupportedExtension).filter(async (file) => !(await cli.isPathIgnored(file)));

  log("Applying ESLint linter and fixer. target files: %O", targetFiles);

  return await cli.lintFiles(targetFiles);
}
