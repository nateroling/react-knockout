import * as ko from "knockout";
import * as React from "react";
import { ReactComponentLike } from "prop-types";

export const reactToKnockout = (
  reactComponent: ReactComponentLike
): KnockoutComponentTypes.ComponentConfig => {
  return { template: "", createViewModel: () => ({}) };
};
