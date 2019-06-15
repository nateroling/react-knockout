import * as ko from "knockout";
import * as React from "react";
import * as ReactDOM from "react-dom";
import { ReactComponentLike } from "prop-types";

export const reactToKnockout = (
  reactComponent: ReactComponentLike
): KnockoutComponentTypes.ComponentConfig => {
  return {
    template: "<div>awesome sauce</div>",
    createViewModel: () => {
      return { component: reactComponent };
    }
  };
};

// Copied from https://github.com/calvinwoo/knockout-bind-react
ko.bindingHandlers.react = {
  init: function(element) {
    console.log("INIT");

    ko.utils.domNodeDisposal.addDisposeCallback(element, function() {
      ReactDOM.unmountComponentAtNode(element);
    });

    console.log("INIT2");
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
