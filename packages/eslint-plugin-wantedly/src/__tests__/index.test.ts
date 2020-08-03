import * as plugin from "..";

it("should match snapshot", () => {
  expect(plugin).toMatchSnapshot();
});
