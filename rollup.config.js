import terser from '@rollup/plugin-terser';
import nodeResolve from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';

import pkg from './package.json';

function pgl(plugins = []) {
  return [
    nodeResolve(),
    commonjs(),
    ...plugins
  ];
}

const umdDist = 'dist/selection-ranges.js';

export default [

  // browser-friendly UMD build
  {
    input: 'lib/index.js',
    output: {
      name: 'SelectionRanges',
      file: umdDist,
      format: 'umd'
    },
    plugins: pgl()
  },
  {
    input: 'lib/index.js',
    output: {
      name: 'SelectionRanges',
      file: umdDist.replace(/\.js$/, '.min.js'),
      format: 'umd'
    },
    plugins: pgl([
      terser()
    ])
  },
  {
    input: 'lib/index.js',
    output: [
      { file: pkg.main, format: 'cjs' },
      { file: pkg.module, format: 'es' }
    ],
    plugins: pgl()
  }
];