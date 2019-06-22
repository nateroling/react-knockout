import * as ko from "knockout";
import * as React from "react";
import { ReactComponentLike } from "prop-types";

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

    // Every time props are updated, update our observables.
    React.useEffect(() => {
      for (const key in props) {
        if (options.makeObservable.indexOf(key) != -1) {
          params[key](props[key]);
        }
      }
    });

    // Call ko.applyBindings just once, when we're first rendered.
    React.useEffect(() => {
      ko.applyBindings(
        { params: params, component: componentName },
        ref.current
      );
      // Return a cleanup function.
      return () => ko.cleanNode(ref.current);
    }, []);

    return (
      <div data-bind="component: {name: component, params: params }" ref={ref}>
        {props.children}
      </div>
    );
  };
};
