import * as ko from "knockout";
import * as React from "react";
import * as ReactDOM from "react-dom";
import { ReactComponentLike } from "prop-types";

export const knockoutToReact = (
  componentName: string,
  options: {
    makeObservable: string[];
    setObservable?: { [value: string]: string };
  } = { makeObservable: [], setObservable: {} }
): ReactComponentLike => {
  return props => {
    const ref = React.useRef(null);

    const [params, setParams] = React.useState(
      (() => {
        const p: any = {};
        for (const key in props) {
          if (options.makeObservable.indexOf(key) != -1) {
            p[key] = ko.observable(props[key]);
            if (options.setObservable && options.setObservable[key]) {
              const setterKey = options.setObservable[key];
              p[key].subscribe((value: any) => p[setterKey](value));
            }
          } else {
            p[key] = props[key];
          }
        }
        return p;
      })()
    );

    const [childrenObs] = React.useState(() => ko.observable(props.children));

    // Every time props are updated, update our observables.
    React.useEffect(() => {
      childrenObs(props.children);
      for (const key in props) {
        if (options.makeObservable.indexOf(key) != -1) {
          params[key](props[key]);
        }
      }
    });

    const [koModel, setKoModel] = React.useState(() => {
      const initial = ko.pureComputed(() => {
        const model = {
          params: params,
          component: componentName,
          reactChildOptions: {
            component: (childProps: any) => <div>{childProps.children}</div>,
            props: { children: childrenObs }
          }
        };
        return model;
      });
      return initial;
    });

    // Call ko.applyBindings just once, when we're first rendered.
    React.useEffect(() => {
      ko.applyBindings(koModel, ref.current);
      // Return a cleanup function.
      return () => ko.cleanNode(ref.current);
    }, []);

    return (
      <div data-bind="component: {name: component, params: params }" ref={ref}>
        <div data-bind="react: $parent.reactChildOptions"></div>
      </div>
    );
  };
};

const KnockoutComponent = (props: {
  templateNodes: Node[];
  bindingContext: any;
}) => {
  const koRef = React.useRef(null);
  React.useEffect(() => {
    if (koRef.current) {
      props.templateNodes.forEach(child => {
        koRef.current.appendChild(child);
      });
      ko.applyBindings(props.bindingContext, koRef.current);
    }
  }, [koRef]);
  return <div ref={koRef}></div>;
};

export const reactToKnockout = (
  reactComponent: ReactComponentLike
): ko.components.Config => ({
  viewModel: {
    createViewModel: function(params: any, componentInfo: any) {
      const props = params;
      const bindingContext = ko
        .contextFor(componentInfo.element)
        .createChildContext({});

      // Wrap knockout child nodes in KnockoutComponent and pass as
      // props.children.
      props.children = (
        <KnockoutComponent
          bindingContext={bindingContext}
          templateNodes={componentInfo.templateNodes}
        />
      );

      const viewModel = {
        reactOptions: {
          component: reactComponent,
          props: params
        }
      };
      return viewModel;
    }
  },
  template: "<div data-bind='react: reactOptions'></div>"
});

// Copied from https://github.com/calvinwoo/knockout-bind-react
ko.bindingHandlers.react = {
  init: function(element) {
    ko.utils.domNodeDisposal.addDisposeCallback(element, function() {
      ReactDOM.unmountComponentAtNode(element);
    });

    return {
      controlsDescendantBindings: true
    };
  },

  update: function(element, valueAccessor, allBindings) {
    var options = ko.unwrap(valueAccessor());

    const props: any = {};
    if (options.props) {
      for (const key of Object.keys(options.props)) {
        props[key] = ko.unwrap(options.props[key]);
      }
    }

    if (options && options.component) {
      var componentInstance = React.createElement(options.component, props);

      if (options.ref) {
        options.ref(componentInstance);
      }

      ReactDOM.render(componentInstance, element);
    }
  }
};
