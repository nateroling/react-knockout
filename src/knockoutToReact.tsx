import * as React from "react";
import * as ko from "knockout";
import { ReactComponentLike } from "prop-types";

type KOConfig = KnockoutComponentTypes.ComponentConfig;

export const knockoutToReact = (componentName: string): ReactComponentLike => {
  return props => {
    const ref = React.useRef(null);

    const [params, setParams] = React.useState(
      (() => {
        const p: any = {};
        for (const key in props) {
          p[key] = ko.observable(props[key]);
        }
        return p;
      })()
    );

    // Every render.
    React.useEffect(() => {
      for (const key in props) {
        params[key](props[key]);
      }
    });

    // Just once.
    React.useEffect(() => {
      ko.applyBindings(
        { params: params, component: componentName },
        ref.current
      );
      return () => ko.cleanNode(ref.current);
    }, []);

    return (
      <div
        data-bind="component: {name: component, params: params }"
        ref={ref}
      />
    );
  };
};
