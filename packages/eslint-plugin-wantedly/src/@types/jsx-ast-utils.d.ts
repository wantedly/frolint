import { TSESTree } from "@typescript-eslint/experimental-utils";

declare module "jsx-ast-utils" {
  export function hasProp(element: TSESTree.JSXAttribute[], name: string): boolean;
}
