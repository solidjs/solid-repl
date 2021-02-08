import { Repl, ReplTab } from '..';
import { render } from 'solid-js/web';

const App = () => {
  return (
    <>
      <Repl
        height="50vh"
        data="https://dev.solidjs.com/examples/counter.json"
      />
      <Repl height="50vh" isInteractive>
        <ReplTab name="main">
          {`
            const App = () => <h1>Hello world!</h1>
          `}
        </ReplTab>
      </Repl>
    </>
  );
};

render(App, document.getElementById('app')!);
