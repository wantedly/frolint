import { BaseContext } from "clipanion";
import { Config } from "cosmiconfig";

export type FrolintConfig = Config & {
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
};
