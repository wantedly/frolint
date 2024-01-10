import { jest } from "@jest/globals";

jest.unstable_mockModule("child_process", () => ({
  execSync: (command: string, options: any) => {
    if (command.includes("hook")) return Buffer.from(".git/hooks\n");
    if (options && options.cwd === "/") {
      return Buffer.from("true\n");
    }
    return Buffer.from("false\n");
  },
}));
const { getPreCommitHookPath, isInsideGitRepository } = await import("../git.js");

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
    it("should return true", async () => {
      const expected = isInsideGitRepository("/");

      expect(expected).toBe(true);
    });

    it("should return false", async () => {
      const expected = isInsideGitRepository("/outside");

      expect(expected).toBe(false);
    });
  });

  describe("getPreCommitHookPath", () => {
    it("should return pre-commit hook path", async () => {
      expect(getPreCommitHookPath("/").endsWith(".git/hooks/pre-commit")).toBe(true);
      expect(getPreCommitHookPath().endsWith(".git/hooks/pre-commit")).toBe(true);
    });
  });
});
