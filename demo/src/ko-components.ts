import * as ko from "knockout";

ko.components.register("app", {
  viewModel: {
    createViewModel: () => {
      return {
        clickCount: ko.observable(0)
      };
    }
  },
  template: `
<h1>Knockout Root</h1>
  <wrapper>
    <clicker params="value: $parent.clickCount"></clicker>
  </wrapper>
`
});

ko.components.register("clicker", {
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

ko.components.register("wrapper", {
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
