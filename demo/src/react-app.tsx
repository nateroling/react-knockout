import * as React from "react";
import { Wrapper, Clicker, KoWrapper } from "./react-components";

export const App = () => {
  const [clickCount, setClickCount] = React.useState(0);
  const increment = () => setClickCount(clickCount + 1);

  return (
    <div>
      <h1>React Root</h1>
      <Wrapper>
        <KoWrapper>
          <Clicker value={clickCount} onClick={increment} />
        </KoWrapper>
      </Wrapper>
    </div>
  );
};
