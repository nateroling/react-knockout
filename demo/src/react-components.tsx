import * as React from "react";

export const App = () => {
  const [clickCount, setClickCount] = React.useState(0);
  const increment = () => setClickCount(clickCount + 1);

  return (
    <div>
      <div>React Component</div>
      <Wrapper>
        <Clicker value={clickCount} onClick={increment} />
      </Wrapper>
    </div>
  );
};

const Clicker = (params: any) => {
  return <button onClick={params.onClick}>{params.value}</button>;
};

const Wrapper = (params: any) => {
  return <div>{params.children}</div>;
};
