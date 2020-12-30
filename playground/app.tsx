import { Repl, ReplTab } from '../src/solid-repl';
import { render } from 'solid-js/web';

const App = () => {
  return (
    <Repl height="50vh" data="https://dev.solidjs.com/examples/counter.json" />
  );
};

render(App, document.getElementById('app')!);
