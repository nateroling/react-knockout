import * as React from "react";
import * as ko from "knockout";
import { ReactComponentLike } from "prop-types";

type KOConfig = KnockoutComponentTypes.ComponentConfig;

export const knockoutToReact = (
  componentName: string,
  options: { makeObservable: string[] } = { makeObservable: [] }
): ReactComponentLike => {
  return props => {
    const ref = React.useRef(null);

    const [params, setParams] = React.useState(
      (() => {
        const p: any = {};
        for (const key in props) {
          if (options.makeObservable.indexOf(key) != -1) {
            p[key] = ko.observable(props[key]);
          } else {
            p[key] = props[key];
          }
        }
        return p;
      })()
    );

    // Every render.
    React.useEffect(() => {
      for (const key in props) {
        if (options.makeObservable.indexOf(key) != -1) {
          params[key](props[key]);
        }
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
