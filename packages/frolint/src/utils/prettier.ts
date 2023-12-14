import { readFileSync } from "fs";
import { extname, resolve } from "path";
import type { BuiltInParserName, ResolveConfigOptions } from "prettier";
import prettier from "prettier";
import prettierConfigWantedly from "prettier-config-wantedly" assert { type: "json" };
import type { FrolintConfig } from "../Context.js";
import { frolintDebug } from "./debug.js";

const log = frolintDebug.extend("prettier");

const supportedLanguages = [
  "JavaScript",
  "Flow",
  "JSX",
  "TypeScript",
  "TSX",
  "JSON.stringify",
  "JSON",
  "JSON with Comments",
  "JSON5",
  "GraphQL",
];

const supportedExtensions = prettier
  .getSupportInfo()
  .languages.filter((lang) => supportedLanguages.includes(lang.name))
  .reduce((acc, lang) => acc.concat(lang.extensions || []), [] as string[]);

/**
 * Set the `ignorePath` config option if it has not been set before.
 * This property should give the path to a `.gitignore` style file.
 */
function setIgnorePath(rootDir: string, prettierConfig: FrolintConfig["prettier"]) {
  if (prettierConfig.ignorePath) {
    return prettierConfig;
  }

  return { ignorePath: resolve(rootDir, ".prettierignore"), ...prettierConfig };
}

function isPrettierSupported(file: string) {
  return supportedExtensions.includes(extname(file));
}

function getInferredParser(file: string, prettierConfig: FrolintConfig["prettier"] = {}): BuiltInParserName {
  return prettier.getFileInfo.sync(file, { ignorePath: prettierConfig.ignorePath }).inferredParser as BuiltInParserName;
}

function isIgnoredForPrettier(file: string, prettierConfig: FrolintConfig["prettier"] = {}) {
  return prettier.getFileInfo.sync(file, { ignorePath: prettierConfig.ignorePath }).ignored;
}

export function applyPrettier(rootDir: string, files: string[], prettierConfig: FrolintConfig["prettier"]) {
  const finalConfig = setIgnorePath(rootDir, prettierConfig);
  log("Supported languages by Prettier: %O", { supportedLanguages, supportedExtensions });
  log("Prettier config: %O", { prettierConfig: finalConfig });

  const targetFiles = files
    .filter((file) => isPrettierSupported(file))
    .filter((file) => !isIgnoredForPrettier(file, finalConfig));

  log("Applying Prettier. target files: %O", targetFiles);

  return targetFiles
    .map((file) => {
      const filePath = resolve(rootDir, file);
      const options = finalConfig.config
        ? { config: resolve(rootDir, finalConfig.config) }
        : (prettierConfigWantedly as ResolveConfigOptions);
      const prettierOption = prettier.resolveConfig.sync(filePath, options);

      if (!prettierOption) {
        return null;
      }

      const input = readFileSync(filePath, "utf8");
      const output = prettier.format(input, {
        parser: getInferredParser(filePath),
        ...prettierOption,
        filepath: filePath,
      });

      if (input === output) {
        return null;
      }

      return { filePath, output };
    })
    .filter(Boolean);
}
