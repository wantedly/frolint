import { BaseContext } from "clipanion";
import { Config } from "cosmiconfig";

export type FrolintContext = BaseContext & {
  cwd: string;
  config?: Config;
};
