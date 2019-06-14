import { reactToKnockout } from "./react-knockout";
import * as React from "react";

const EmptyDivComponent = (props: unknown) => <div />;

test("reactToKnockout returns a valid Knockout component config", () => {
  const result = reactToKnockout(EmptyDivComponent);
  expect(result).toHaveProperty("template");
  expect(typeof result.template).toBe("string");
  expect(result).toHaveProperty("createViewModel");
  expect(result.createViewModel).toBeInstanceOf(Function);
});

test("reactToKnockout creates a valid viewModel", () => {
  const params: unknown = null;
  const componentInfo: unknown = null;
  const config = reactToKnockout(EmptyDivComponent);
  const viewModel = config.createViewModel(params, componentInfo);

  expect(viewModel).toBeInstanceOf(Object);
});
