import defineConfig from 'rollup-preset-solid';

export default defineConfig({
  input: 'src/solid-repl.tsx',
  external: ['@amoutonbrady/lz-string'],
  printInstructions: true,
});
