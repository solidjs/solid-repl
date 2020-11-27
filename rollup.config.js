import del from 'rollup-plugin-delete';
import cjs from '@rollup/plugin-commonjs';
import { babel } from '@rollup/plugin-babel';
import { terser } from 'rollup-plugin-terser';
import { nodeResolve } from '@rollup/plugin-node-resolve';

import pkg from './package.json';

const extensions = ['.ts', '.js', '.tsx'];

/**
 * @type {import('rollup').RollupOptions}
 */
const config = {
  input: ['src/solid-repl.tsx'],
  output: [
    {
      dir: pkg.module.replace('/solid-repl.js', ''),
      format: 'esm',
    },
    {
      dir: pkg.main.replace('/solid-repl.js', ''),
      format: 'cjs',
    },
  ],
  treeshake: {
    moduleSideEffects: false,
    propertyReadSideEffects: false,
    tryCatchDeoptimization: false,
  },
  strictDeprecations: true,
  external: [
    'solid-js',
    'solid-js/web',
    /codemirror.*/,
    /rollup.*/,
    '@babel/standalone',
    'babel-preset-solid',
    'oceanwind',
  ],
  plugins: [
    del({ targets: 'dist/*' }),
    babel({
      extensions,
      babelHelpers: 'bundled',
      presets: ['babel-preset-solid', '@babel/preset-typescript'],
    }),
    nodeResolve({ extensions, browser: true }),
    cjs({ extensions }),
    terser(),
  ],
};

export default config;
