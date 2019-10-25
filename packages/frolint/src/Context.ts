import { BaseContext } from "clipanion";

export type FrolintContext = BaseContext & {
  cwd: string;
};
