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
<div>Knockout Component</div>
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
  template: "<button data-bind='text: value, click: increment'></button>"
});

ko.components.register("wrapper", {
  viewModel: {
    createViewModel: () => ({})
  },
  template:
    "<div data-bind='template: { nodes: $componentTemplateNodes }'></div>"
});
