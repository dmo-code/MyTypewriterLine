const typescript = require('rollup-plugin-typescript2');
const { nodeResolve } = require('@rollup/plugin-node-resolve');
const copy = require('rollup-plugin-copy');

module.exports = {
  input: 'main.ts',
  output: {
    dir: 'dist',
    format: 'cjs',
    sourcemap: false,
    entryFileNames: 'main.js',
  },
  external: ['obsidian'],
  plugins: [
    nodeResolve(),
    typescript({
      tsconfig: './tsconfig.json',
      useTsconfigDeclarationDir: true
    }),
    copy({
      targets: [
        { src: 'manifest.json', dest: 'dist' }
      ]
    })
  ]
};
