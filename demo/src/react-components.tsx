import * as React from "react";
import { knockoutToReact } from "../../src/react-knockout";

export const Clicker = (params: any) => {
  return (
    <div className="react clicker">
      <h1>I am a clicker. Click my button:</h1>
      <button onClick={params.onClick}>
        Clickers have been clicked {params.value} times.
      </button>
    </div>
  );
};

export const Wrapper = (params: any) => {
  return (
    <div className="react wrapper">
      <h1>I am a wrapper. I wrap children:</h1>
      <div className="wrapper--children">{params.children}</div>
    </div>
  );
};

export const KoWrapper = knockoutToReact("ko-wrapper");
export const KoClicker = knockoutToReact("ko-clicker", {
  makeObservable: ["value"],
  setObservable: { value: "setValue" }
});
