import { CLIEngine } from "eslint";
import { resolve } from "path";
import { sync } from "resolve";
import type { FrolintConfig } from "../Context";

function detectReactVersion(basedir: string) {
  try {
    const reactPath = sync("react", { basedir });
    const react = require(reactPath);
    return react.version;
  } catch (e) {
    return null;
  }
}

export function getCLI(
  rootDir: string,
  eslintConfigPackage = "eslint-config-wantedly-typescript",
  eslintConfig: FrolintConfig["eslint"] = {}
) {
  const reactVersion = detectReactVersion(rootDir);
  const isReact = !!reactVersion;
  const netEslintConfigPackage = eslintConfigPackage.replace("eslint-config-", "") + (isReact ? "" : "/without-react");
  const reactSettings = reactVersion
    ? {
        react: {
          version: reactVersion,
        },
      }
    : {};
  const cacheLocation = resolve(rootDir, "node_modules", ".frolintcache");

  const cli = new CLIEngine({
    baseConfig: { extends: [netEslintConfigPackage], settings: { ...reactSettings } },
    fix: true,
    cwd: rootDir,
    ignorePath: eslintConfig.ignorePath,
    cache: true,
    cacheLocation,
  });

  return cli;
}

function isSupportedExtension(file: string) {
  return /(jsx?|tsx?)$/.test(file);
}

export function applyEslint(
  rootDir: string,
  files: string[],
  eslintConfigPackage: string,
  eslintConfig: FrolintConfig["eslint"]
) {
  const cli = getCLI(rootDir, eslintConfigPackage, eslintConfig);
  return cli.executeOnFiles(files.filter(isSupportedExtension).filter((file) => !cli.isPathIgnored(file)));
}
