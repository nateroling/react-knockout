import * as ko from "knockout";
import { reactToKnockout } from "../../src/react-knockout";
import { Wrapper, Clicker } from "./react-components";

ko.components.register("app", {
  viewModel: {
    createViewModel: () => {
      const clickCount = ko.observable(0);
      return {
        clickCount: clickCount,
        increment: () => clickCount(clickCount() + 1)
      };
    }
  },
  template: `
<h1>Knockout Root</h1>
  <ko-clicker params="value: clickCount"></ko-clicker>
  <react-clicker params="value: clickCount, onClick: increment"></react-clicker>
  <ko-wrapper>
    <react-clicker params="value: $parent.clickCount, onClick: $parent.increment"></react-clicker>
    <ko-clicker params="value: $parent.clickCount"></ko-clicker>
  </ko-wrapper>
  <react-wrapper>
    <ko-clicker params="value: $parent.clickCount"></ko-clicker>
    <react-clicker params="value: $parent.clickCount, onClick: $parent.increment"></react-clicker>
  </react-wrapper>
`
});

ko.components.register("ko-clicker", {
  viewModel: {
    createViewModel: (params: { value: any }) => {
      return {
        value: params.value,
        increment: () => {
          params.value(params.value() + 1);
        }
      };
    }
  },
  template: `
<div class="knockout clicker">
  <h1>I am a clicker. Click my button:</h1>
  <button data-bind='click: increment'>
    Clickers have been clicked <span data-bind='text: value'></span> times.
  </button>
</div>
`
});

ko.components.register("ko-wrapper", {
  viewModel: {
    createViewModel: () => ({})
  },
  template: `
<div class='knockout wrapper'>
  <h1>I am a wrapper. I wrap children:</h1>
  <div class="wrapper--children" data-bind='template: { nodes: $componentTemplateNodes }'></div>
</div>
`
});

ko.components.register("react-wrapper", reactToKnockout(Wrapper));
ko.components.register("react-clicker", reactToKnockout(Clicker));
