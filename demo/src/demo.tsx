import * as React from "react";
import * as ReactDOM from "react-dom";

const init = () => {
  ReactDOM.render(<App />, document.getElementById("root"));
};

const App = () => {
  return <div>Awesome</div>;
};

init();
