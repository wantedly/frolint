import { readFileSync } from "fs";
import { extname, resolve } from "path";
import type { BuiltInParserName, ResolveConfigOptions } from "prettier";
import prettier from "prettier";
import prettierConfigWantedly from "prettier-config-wantedly";
import type { FrolintConfig } from "../Context";
import { frolintDebug } from "./debug";

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
  log("Supported languages by Prettier: %O", { supportedLanguages, supportedExtensions });
  log("Prettier config: %O", { prettierConfig });

  const targetFiles = files
    .filter((file) => isPrettierSupported(file))
    .filter((file) => !isIgnoredForPrettier(file, prettierConfig));

  log("Applying Prettier. target files: %O", targetFiles);

  return targetFiles
    .map((file) => {
      const filePath = resolve(rootDir, file);
      const options = prettierConfig.config
        ? { config: resolve(rootDir, prettierConfig.config) }
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
