import type { BaseContext } from "clipanion";

export type FrolintConfig = {
  typescript: boolean;
  formatter?: string;
  eslint: {
    ignorePath?: string;
  };
  prettier: {
    config?: string;
    ignorePath?: string;
  };
};

export type FrolintContext = BaseContext & {
  cwd: string;
  config: FrolintConfig;
  preCommit: boolean;
  version: string;
};
