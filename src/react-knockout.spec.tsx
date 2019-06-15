import { reactToKnockout } from "./react-knockout";
import * as React from "react";
import * as ko from "knockout";

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

test("reactToKnockout components can be render via react binding", () => {
  document.body.innerHTML = `<div data-bind="{ react: { component: component }}">`;
  expect(document.body.firstElementChild.tagName).toBe("DIV");
  expect(document.body.firstElementChild.childElementCount).toBe(0);

  ko.applyBindings({ component: EmptyDivComponent }, document.body);
  expect(document.body.firstElementChild.tagName).toBe("DIV");
  expect(document.body.firstElementChild.childElementCount).toBe(1);
});
