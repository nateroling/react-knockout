import * as React from "react";
import * as ReactDOM from "react-dom";
import "./ko-components";
import { App } from "./react-app";

// Initialize the React root component.
ReactDOM.render(<App />, document.getElementById("react-root"));

// Initialize the Knockout root component.
ko.applyBindings({}, document.getElementById("ko-root"));
