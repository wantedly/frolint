import { JSXAttribute, JSXSpreadAttribute } from "estree-jsx";

declare module "jsx-ast-utils" {
  export function hasProp(element: Array<JSXAttribute | JSXSpreadAttribute>, name: string): boolean;
}
