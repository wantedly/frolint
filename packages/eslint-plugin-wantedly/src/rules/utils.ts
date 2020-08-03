export function getOptionWithDefault(context: any, defaultOption: any) {
  return context.options.reduce((acc: any, obj: any) => ({ ...acc, ...obj }), defaultOption);
}

export function docsUrl(ruleName: string) {
  return `https://github.com/wantedly/frolint/tree/master/packages/eslint-plugin-wantedly/docs/rules/${ruleName}.md`;
}
