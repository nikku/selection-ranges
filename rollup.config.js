import uglify from 'rollup-plugin-uglify';
import nodeResolve from 'rollup-plugin-node-resolve';
import commonjs from 'rollup-plugin-commonjs';

import pkg from './package.json';

function pgl(plugins=[]) {
  return [
    nodeResolve({
      jsnext: true,
      main: true
    }),
    commonjs(),
    ...plugins
  ];
}

export default [
  // browser-friendly UMD build
  {
    input: 'lib/index.js',
    output: {
      name: 'SelectionRanges',
      file: pkg.browser,
      format: 'umd'
    },
    plugins: pgl()
  },
  {
    input: 'lib/index.js',
    output: {
      name: 'SelectionRanges',
      file: pkg.browser.replace(/\.js$/, '.min.js'),
      format: 'umd'
    },
    plugins: pgl([
      uglify()
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