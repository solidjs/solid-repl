# Solid REPL

A re-usable [solid](https://github.com/ryansolid/solid) component that provides an embedable REPL.

- [Solid REPL](#solid-repl)
  - [Usage](#usage)
    - [Installation](#installation)
    - [In practice](#in-practice)
    - [Options](#options)
      - [Repl options](#repl-options)
      - [ReplTab options](#repltab-options)
  - [Contributing](#contributing)
  - [Technical details](#technical-details)
    - [How does it work?](#how-does-it-work)
  - [TODOs](#todos)
  - [Credits](#credits)

## Usage

[Demo available here](https://codesandbox.io/s/solid-repl-example-xr6de?file=/src/index.tsx)

### Installation

```bash
# npm
npm install solid-repl

# pnpm
pnpm add solid-repl

# yarn
yarn add solid-repl
```

### In practice

In a nutshell this is how you'd use it:

```tsx
import { Repl, ReplTab } from 'solid-repl';
import { render } from 'solid-js/web';

const App = () => {
  return (
    <Repl
      baseUrl="https://solid-playground.netlify.app"
      height={500}
      withHeader
      isInteractive
    >
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
```

### Options

#### Repl options

| name            | required | type    | default                           | description                       | 
| --------------- | -------- | ------- | --------------------------------- | --------------------------------- | 
| `baseUrl`       | false    | string  | `https://playground.solidjs.com/` | The source of the iframe          | 
| `height`        | false    | number  | `250`                             | The height in pixel               | 
| `withHeader`    | false    | boolean | `false`                           | Whether to show or not            | 
| `isInteractive` | false    | boolean | `false`                           | Whether it's interactive or not   | 

#### ReplTab options

| name   | required | type   | default | description     | 
| ------ | -------- | ------ | ------- | --------------- | 
| `name` | true     | string | -       | Name of the tab | 

## Contributing

This project uses the [pnpm](https://pnpm.js.org/) package manager. You should install this one if you want to contribute.
This project uses [prettier](https://prettier.io/) to format code. A `format` npm script can be used to format the code.

In order to contribute you can :

1. Clone the reposotory: `git clone git@github.com:ryansolid/solid-repl.git`
2. Install the dependencies: `pnpm install`
3. Operate you changes: `pnpm test` will load a live server to preview your changes on [http://localhost:1234](http://localhost:1234)
4. (optional) Run `pnpm format` to format the code if you don't have that automatically in your IDE

## Technical details

This package is a simple wrapper around the [solid playground](https://github.com/ryansolid/solid-playground) as an iframe.
**The below information are related to the solid-playground of the iframe.**

### How does it work?

Basically, each "tab" acts as a virtual file. This virtual file system is represented by a global array of tabs.

On every tab source change, rollup parses all the file and create an ESM bundle. This ESM bundle is injected into an iframe with a `<script type="module">` that loads this bundle.

As you can imagine, loading rollup, babel, solid compiler and a fully blown out code editor in the browser is expensive in term of size. The final JS loaded is about 2.5mb from primer tests. This size could be reduce by carefully importing exactly what's needed.
In order to mitigate that, babel, solid compiler (which is a babel preset) and rollup are lazy loaded and injected into the window.

## TODOs

- [x] Produce a consumable package
- [x] Have a way to test the package within the repository (either via test or a simple playground that imports the compiled output)
- [ ] Make [worker.ts](./src/worker.ts) an actual worker. [comlink](https://github.com/GoogleChromeLabs/comlink) could make this easier. We need to see how we can manage lazy loaded packages in a Web Worker and how to package it for end user.
- [x] Debouncing [the compile function](./src/solid-repl.tsx#L34) to avoid a bazillion rollup compilations
- [x] Handle rollup/babel errors
- [x] Make CodeMirror more friendlier
- [x] Making the REPL reponsive
- [x] Showing output compilation
- [x] Having an option to save state (either via an URL or/and localStorage)
- [ ] Provide a way to change solid's compiler version
- [ ] Show a console for console logs
- [x] Implements some sort of fake HMR to avoid full reload (might be done through iframe message communication)
- [x] Improve bundle size

## Credits

Technologies/libraries used to make this possible:

- [Solid-js](https://github.com/ryansolid/solid) - The rendering library
- [CodeMirror 6](https://codemirror.net/6) - The code editor
- [Babel](https://babeljs.io/docs/en/babel-standalone) - The standalone version for in-browser compilation
- [Rollup](https://rollupjs.org/) - The standalone version for in-browser bundling
- [Tailwindcss](https://tailwindcss.com/) - For any styles
- [Skypack](https://www.skypack.dev/) - CDN powering every external imports outside of solid-js and virtual file system
