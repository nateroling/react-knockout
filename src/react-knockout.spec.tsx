import { reactToKnockout } from "./react-knockout";
import * as React from "react";
import * as ko from "knockout";

const EmptyDivComponent = (props: unknown) => <div />;

let root: Element = null;

beforeEach(() => {
  document.body.innerHTML = "";
  root = document.createElement("main");
  document.body.append(root);
});

afterEach(() => {
  ko.cleanNode(root);
});

test("reactToKnockout returns a valid Knockout component config", () => {
  const result = reactToKnockout(EmptyDivComponent);
  expect(result).toHaveProperty("template");
  expect(typeof result.template).toBe("string");
  expect(result).toHaveProperty("viewModel");
  expect(result.viewModel).toHaveProperty("createViewModel");
  //expect(result.viewModel.createViewModel).toBeInstanceOf(Function);
});

test("reactToKnockout creates a valid viewModel", () => {
  const params: unknown = null;
  const componentInfo: KnockoutComponentTypes.ComponentInfo = null;
  const config = reactToKnockout(EmptyDivComponent);

  const viewModel = (config.viewModel as KnockoutComponentTypes.ViewModelFactoryFunction).createViewModel(
    params,
    componentInfo
  );

  expect(viewModel).toBeInstanceOf(Object);
});

test("reactToKnockout components can be rendered via react binding", () => {
  const component = () => <div>SUCCESS</div>;
  root.innerHTML = `<div data-bind="{ react: { component: component }}">`;
  expect(root.firstElementChild.tagName).toBe("DIV");
  expect(root.firstElementChild.childElementCount).toBe(0);

  ko.applyBindings({ component: component }, root);
  expect(root.firstElementChild.tagName).toBe("DIV");
  expect(root.firstElementChild.childElementCount).toBe(1);
  expect(root.firstElementChild.firstElementChild.textContent).toBe("SUCCESS");
});

test("reactToKnockout components can be registered and rendered", done => {
  const component = () => <div>SUCCESS</div>;
  const config = reactToKnockout(component);
  ko.components.register("test-component", config);

  root.innerHTML = `<test-component></test-component>`;
  expect(root.firstElementChild.tagName).toBe("TEST-COMPONENT");
  expect(root.firstElementChild.childElementCount).toBe(0);

  ko.applyBindings({}, root);

  // TODO Find another way to wait for KO to apply component bindings.
  setTimeout(() => {
    expect(root.firstElementChild.tagName).toBe("TEST-COMPONENT");
    expect(root.firstElementChild.childElementCount).toBe(1);
    expect(root.firstElementChild.firstElementChild.textContent).toBe(
      "SUCCESS"
    );
    done();
  }, 100);
});
