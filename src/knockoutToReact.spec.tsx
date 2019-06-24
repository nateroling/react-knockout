import * as ko from "knockout";
import * as React from "react";
import * as ReactDOM from "react-dom";
import { knockoutToReact } from "./react-knockout";
import { act } from "react-dom/test-utils";

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

test("knockoutToReact binds a named component with componentTemplateNodes", done => {
  const config = {
    viewModel: { createViewModel: () => ({}) },
    template: `<span data-bind="template: { nodes: $componentTemplateNodes }"></span>`
  };
  registerComponent("test-component", config);
  const Component = knockoutToReact("test-component");
  ReactDOM.render(<Component>SUCCESS</Component>, root);
  setTimeout(() => {
    expect(root.innerHTML).toContain("SUCCESS");
    done();
  }, 100);
});

test("knockoutToReact updates a named component with componentTemplateNodes", done => {
  const config = {
    viewModel: { createViewModel: () => ({}) },
    template: `<span data-bind="template: { nodes: $componentTemplateNodes }"></span>`
  };
  registerComponent("test-component", config);
  const Component = knockoutToReact("test-component");
  ReactDOM.render(<Component>INITIAL</Component>, root);
  setTimeout(() => {
    expect(root.innerHTML).toContain("INITIAL");

    ReactDOM.render(<Component>SUCCESS</Component>, root);
    setTimeout(() => {
      expect(root.innerHTML).toContain("SUCCESS");
      done();
    }, 100);
  }, 100);
});

test("knockoutToReact updates a named component child content with componentTemplateNodes", done => {
  const config = {
    viewModel: { createViewModel: () => ({ content: "SUCCESS" }) },
    template: `<span data-bind="template: { nodes: $componentTemplateNodes }"></span>`
  };
  registerComponent("test-component", config);
  const KOParent = knockoutToReact("test-component");
  const ReactChild = (props: { children: any }) => <div>{props.children}</div>;
  let message = "INITIAL";

  ReactDOM.render(
    <KOParent>
      <ReactChild>{message}</ReactChild>
    </KOParent>,
    root
  );
  setTimeout(() => {
    expect(root.innerHTML).toContain("INITIAL");

    message = "SUCCESS";
    ReactDOM.render(
      <KOParent>
        <ReactChild>{message}</ReactChild>
      </KOParent>,
      root
    );
    setTimeout(() => {
      expect(root.innerHTML).toContain("SUCCESS");
      done();
    }, 100);
  }, 100);
});

test("knockoutToReact updates a named component child props with componentTemplateNodes", done => {
  const config = {
    viewModel: { createViewModel: () => ({ content: "SUCCESS" }) },
    template: `<span data-bind="template: { nodes: $componentTemplateNodes }"></span>`
  };
  registerComponent("test-component", config);
  const KOParent = knockoutToReact("test-component");
  const ReactChild = (props: { value: string }) => <div>{props.value}</div>;
  let message = "INITIAL";

  ReactDOM.render(
    <KOParent>
      <ReactChild value={message}></ReactChild>
    </KOParent>,
    root
  );
  setTimeout(() => {
    expect(root.innerHTML).toContain("INITIAL");

    message = "SUCCESS";
    ReactDOM.render(
      <KOParent>
        <ReactChild value={message}></ReactChild>
      </KOParent>,
      root
    );
    setTimeout(() => {
      expect(root.innerHTML).toContain("SUCCESS");
      done();
    }, 100);
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

test("knockoutToReact make observables to callbacks", done => {
  const config = {
    viewModel: {
      createViewModel: (params: any) => ({
        content: params.content,
        updateContent: () => params.content("SUCCESS")
      })
    },
    template: `<span id="target" data-bind="click: updateContent"></span>`
  };
  registerComponent("test-component", config);
  const Component = knockoutToReact("test-component", {
    makeObservable: ["content"],
    setObservable: { content: "setContent" }
  });

  const Parent = () => {
    const [content, setContent] = React.useState("INITIAL");
    return (
      <div>
        {content}
        <Component content={content} setContent={setContent}></Component>
      </div>
    );
  };

  ReactDOM.render(<Parent />, root);

  setTimeout(() => {
    expect(root.innerHTML).toContain("INITIAL");

    act(() => {
      document.getElementById("target").dispatchEvent(
        new MouseEvent("click", {
          view: window,
          bubbles: true,
          cancelable: true
        })
      );
    });

    expect(root.innerHTML).toContain("SUCCESS");
    done();
  }, 100);
});
