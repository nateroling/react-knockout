import * as React from "react";
import * as ReactDOM from "react-dom";
import * as ko from "knockout";
import renderer from "react-test-renderer";
import { knockoutToReact } from "./knockoutToReact";

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

test("knockoutToReact binds a named component without params", done => {
  const config = {
    viewModel: { createViewModel: () => ({ content: "SUCCESS" }) },
    template: `<span data-bind="text: content"></span>`
  };
  registerComponent("test-component", config);
  const Component = knockoutToReact("test-component");
  ReactDOM.render(<Component />, root);
  setTimeout(() => {
    expect(root.innerHTML).toContain("SUCCESS");
    done();
  }, 100);
});

test("knockoutToReact binds a named component with params", done => {
  const config = {
    viewModel: {
      createViewModel: (params: any) => ({ content: params.content })
    },
    template: `<span data-bind="text: content"></span>`
  };
  registerComponent("test-component", config);
  const Component = knockoutToReact("test-component");
  ReactDOM.render(<Component content="SUCCESS" />, root);
  setTimeout(() => {
    expect(root.innerHTML).toContain("SUCCESS");
    done();
  }, 100);
});

test("knockoutToReact ignores non-observable params", done => {
  const config = {
    viewModel: {
      createViewModel: (params: any) => ({ content: params.content })
    },
    template: `<span data-bind="text: content"></span>`
  };
  registerComponent("test-component", config);
  const Component = knockoutToReact("test-component");

  // Re-render with initial props.
  ReactDOM.render(<Component content="INITIAL" />, root);
  setTimeout(() => {
    expect(root.innerHTML).toContain("INITIAL");

    // Re-render with updated props.
    ReactDOM.render(<Component content="SUCCESS" />, root);
    setTimeout(() => {
      expect(root.innerHTML).toContain("INITIAL");
      done();
    }, 100);
  }, 100);
});

test("knockoutToReact creates observable params", done => {
  const config = {
    viewModel: {
      createViewModel: (params: any) => ({ content: params.content })
    },
    template: `<span data-bind="text: content"></span>`
  };
  registerComponent("test-component", config);
  const Component = knockoutToReact("test-component", {
    makeObservable: ["content"]
  });

  // Re-render with initial props.
  ReactDOM.render(<Component content="INITIAL" />, root);
  setTimeout(() => {
    expect(root.innerHTML).toContain("INITIAL");

    // Re-render with updated props.
    ReactDOM.render(<Component content="SUCCESS" />, root);
    setTimeout(() => {
      expect(root.innerHTML).toContain("SUCCESS");
      done();
    }, 100);
  }, 100);
});