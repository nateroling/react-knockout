import * as ko from "knockout";
import * as React from "react";
import * as ReactDOM from "react-dom";
import { ReactComponentLike } from "prop-types";

export const reactToKnockout = (
  reactComponent: ReactComponentLike
): KnockoutComponentTypes.ComponentConfig => ({
  viewModel: {
    createViewModel: function(params, componentInfo) {
      const props = params;
      const bindingContext = ko.contextFor(componentInfo.element);

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

    if (options && options.component) {
      var componentInstance = React.createElement(
        options.component,
        options.props
      );

      if (options.ref) {
        options.ref(componentInstance);
      }

      ReactDOM.render(componentInstance, element);
    }
  }
};

const KnockoutComponent = (props: {
  children?: React.ReactElement[];
  templateNodes: Node[];
  bindingContext: any;
}) => {
  const koRef = React.useRef(null);
  React.useEffect(() => {
    if (koRef.current) {
      props.templateNodes.forEach(child => {
        koRef.current.appendChild(child);
      });
      ko.applyBindings({}, koRef.current);
    }
  }, [koRef]);
  return <div ref={koRef}>{props.children}</div>;
};
