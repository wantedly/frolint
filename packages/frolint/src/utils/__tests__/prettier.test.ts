import { fileURLToPath } from "node:url";
import { dirname } from "node:path";
import fs from "fs";
import { resolve } from "path";

import { applyPrettier } from "../prettier.js";

const { writeFileSync, writeFile, unlinkSync } = fs;

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

describe("prettier", () => {
  /** Temporary file for running tests */
  const testFilename = resolve(__dirname, "../testcontent.js");
  /** Example content that prettier should be trying to fix */
  const baseContent = `const test = {
} ;`;

  function createTestFile() {
    (writeFileSync || writeFile)(testFilename, baseContent);
  }
  function deleteTestFile() {
    return unlinkSync(testFilename);
  }

  it("formats file", () => {
    createTestFile();
    // First check that the file is correctly formatted
    const formatResult = applyPrettier(__dirname, [testFilename], {});
    // @ts-expect-error don't bother checking the length of the array
    expect(formatResult[0].filePath).toBe(testFilename);
    // @ts-expect-error don't bother checking the length of the array
    expect(formatResult[0].output).not.toBe(baseContent);

    deleteTestFile();
  });

  it("ignores files according to patterns", () => {
    createTestFile();
    // Now add the ignore files to check there are no results
    expect(
      applyPrettier(__dirname, [testFilename], {
        ignorePath: resolve(__dirname, ".testignore"),
      })
    ).toEqual([]);
    deleteTestFile();
  });
});
