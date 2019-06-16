import { reactToKnockout } from "./react-knockout";
import * as React from "react";
import * as ko from "knockout";

const EmptyDivComponent = (props: unknown) => <div />;
const containerTemplate =
  "<span data-bind='template: { nodes: $componentTemplateNodes }'></span>";

let root: Element = null;

// Keep track of registered components for cleanup.
const registeredComponents: string[] = [];
const registerComponent = (name: string, config: any) => {
  registeredComponents.push(name);
  ko.components.register(name, config);
};

beforeEach(() => {
  document.body.innerHTML = "";
  root = document.createElement("main");
  document.body.append(root);
});

afterEach(() => {
  ko.cleanNode(root);
  registeredComponents.forEach(x => ko.components.unregister(x));
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
  const params: unknown = {};
  const componentInfo = { element: root, templateNodes: [] as Element[] };
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
  expect(root.innerHTML).toContain("SUCCESS");
});

test("reactToKnockout components can be registered and rendered", done => {
  const component = () => <div>SUCCESS</div>;
  const config = reactToKnockout(component);
  registerComponent("test-component", config);

  root.innerHTML = `<test-component></test-component>`;
  expect(root.firstElementChild.tagName).toBe("TEST-COMPONENT");
  expect(root.firstElementChild.childElementCount).toBe(0);

  ko.applyBindings({}, root);

  // TODO Find another way to wait for KO to apply component bindings.
  setTimeout(() => {
    expect(root.innerHTML).toContain("SUCCESS");
    done();
  }, 100);
});

test("reactToKnockout components can have params", done => {
  const component = (props: { content: string }) => <div>{props.content}</div>;
  const config = reactToKnockout(component);
  registerComponent("test-component", config);

  root.innerHTML = `<test-component params="content: 'SUCCESS'"></test-component>`;
  expect(root.firstElementChild.tagName).toBe("TEST-COMPONENT");
  expect(root.firstElementChild.childElementCount).toBe(0);

  ko.applyBindings({}, root);

  // TODO Find another way to wait for KO to apply component bindings.
  setTimeout(() => {
    expect(root.innerHTML).toContain("SUCCESS");
    done();
  }, 100);
});

test("reactToKnockout components can have children", done => {
  const component = (props: { children: string }) => (
    <div>{props.children}</div>
  );
  const config = reactToKnockout(component);
  registerComponent("test-component", config);

  root.innerHTML = `<test-component>SUCCESS</test-component>`;
  expect(root.firstElementChild.tagName).toBe("TEST-COMPONENT");
  expect(root.firstElementChild.childElementCount).toBe(0);

  ko.applyBindings({}, root);

  // TODO Find another way to wait for KO to apply component bindings.
  setTimeout(() => {
    expect(root.innerHTML).toContain("SUCCESS");
    done();
  }, 100);
});

test("reactToKnockout components can have reactToKnockout children", done => {
  const parent = (props: { children: any }) => <span>{props.children}</span>;
  const child = () => <span>SUCCESS</span>;
  const parentConfig = reactToKnockout(parent);
  const childConfig = reactToKnockout(child);
  registerComponent("parent-component", parentConfig);
  registerComponent("child-component", childConfig);

  root.innerHTML = `<parent-component><child-component></child-component></parent-component>`;
  ko.applyBindings({}, root);

  // TODO Find another way to wait for KO to apply component bindings.
  setTimeout(() => {
    expect(root.innerHTML).toContain("SUCCESS");
    done();
  }, 100);
});

test("reactToKnockout components can access KO context", done => {
  const child = (props: { content: string }) => <span>{props.content}</span>;
  const parentConfig = {
    viewModel: {
      createViewModel: () => {
        return {
          content: "SUCCESS"
        };
      }
    },
    template: containerTemplate
  };
  const childConfig = reactToKnockout(child);
  registerComponent("parent-component", parentConfig);
  registerComponent("child-component", childConfig);

  root.innerHTML = `<parent-component><child-component params="content: content"></child-component></parent-component>`;
  ko.applyBindings({}, root);

  // TODO Find another way to wait for KO to apply component bindings.
  setTimeout(() => {
    expect(root.innerHTML).toContain("SUCCESS");
    done();
  }, 100);
});

test("reactToKnockout components can access KO $parent context", done => {
  const child = (props: { content: string }) => <span>{props.content}</span>;
  const parentConfig = {
    viewModel: { createViewModel: () => {} },
    template: containerTemplate
  };
  const grandparentConfig = {
    viewModel: {
      createViewModel: () => ({ content: "SUCCESS" })
    },
    template: containerTemplate
  };

  registerComponent("c-a", grandparentConfig);
  registerComponent("c-b", parentConfig);
  registerComponent("c-c", reactToKnockout(child));
  root.innerHTML = `<c-a><c-b><c-c params="content: $parent.content"></c-c></c-b></c-a>`;
  ko.applyBindings({}, root);

  // TODO Find another way to wait for KO to apply component bindings.
  setTimeout(() => {
    expect(root.innerHTML).toContain("SUCCESS");
    done();
  }, 100);
});
