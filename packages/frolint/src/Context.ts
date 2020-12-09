import type { BaseContext } from "clipanion";
import type { Debugger } from "debug";

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

export interface FrolintContext extends BaseContext {
  cwd: string;
  config: FrolintConfig;
  preCommit: boolean;
  version: string;
  debug: (namespace: string) => Debugger;
}
