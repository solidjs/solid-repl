import { Repl, ReplTab } from '../src/solid-repl';
import { render } from 'solid-js/web';

const App = () => {
  return (
    <Repl>
      <ReplTab name="main">
        {`
          import { render } from 'solid-js/web';
          import { App } from './app.tsx';
          
          render(App, document.getElementById('app'));
        `}
      </ReplTab>
      <ReplTab name="app">
        {'export const App = () => <h1>Hello world</h1>'}
      </ReplTab>
    </Repl>
  );
};

render(App, document.getElementById('app')!);
