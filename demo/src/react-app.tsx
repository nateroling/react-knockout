import * as React from "react";
import { Wrapper, Clicker, KoWrapper, KoClicker } from "./react-components";

export const App = () => {
  const [clickCount, setClickCount] = React.useState(0);
  const increment = () => setClickCount(clickCount + 1);

  return (
    <div>
      <h1>React Root</h1>
      <Clicker value={clickCount} onClick={increment} />
      <KoClicker value={clickCount} setValue={setClickCount} />
      <Wrapper>
        <KoClicker value={clickCount} setValue={setClickCount} />
        <Clicker value={clickCount} onClick={increment} />
      </Wrapper>
      <KoWrapper>
        <Clicker value={clickCount} onClick={increment} />
        <KoClicker value={clickCount} setValue={setClickCount} />
      </KoWrapper>
    </div>
  );
};
