const plugin = require("..");

it("should match snapshot", () => {
  expect(plugin).toMatchSnapshot();
});
