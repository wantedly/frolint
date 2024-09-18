import { execSync } from "child_process";

import { getPreCommitHookPath, isInsideGitRepository } from "../git";

jest.mock("child_process");
jest.mock("fs");

//   mock({
//     "/.git": {},
//     "/foo.js": "foo()",
//     "/bar.ts": "bar()",
//     "/baz.js": "baz()",
//   });

describe("git", () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  describe("isInsideGitRepository", () => {
    beforeEach(() => {
      (execSync as jest.MockedFunction<typeof execSync>).mockImplementation((_command, options) => {
        if (options && options.cwd === "/") {
          return Buffer.from("true\n");
        }
        return Buffer.from("false\n");
      });
    });

    it("should return true", () => {
      const expected = isInsideGitRepository("/");

      expect(expected).toBe(true);
    });

    it("should return false", () => {
      const expected = isInsideGitRepository("/outside");

      expect(expected).toBe(false);
    });
  });

  describe("getPreCommitHookPath", () => {
    it("should return pre-commit hook path", () => {
      (execSync as jest.MockedFunction<typeof execSync>).mockImplementation((_command, _options) => {
        return Buffer.from(".git/hooks\n");
      });

      expect(getPreCommitHookPath("/").endsWith(".git/hooks/pre-commit")).toBe(true);
      expect(getPreCommitHookPath().endsWith(".git/hooks/pre-commit")).toBe(true);
    });
  });
});
