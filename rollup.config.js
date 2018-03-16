import uglify from 'rollup-plugin-uglify';
import nodeResolve from 'rollup-plugin-node-resolve';
import commonjs from 'rollup-plugin-commonjs';

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
  {
    input: 'lib/index.js',
    output: {
      file: 'dist/index.mjs',
      format: 'es'
    },
    plugins: pgl()
  },
  {
    input: 'lib/index.js',
    output: {
      file: 'dist/index.js',
      format: 'cjs'
    },
    plugins: pgl()
  },
  {
    input: 'lib/index.js',
    output: {
      name: 'SelectionRanges',
      file: 'dist/selection-ranges.js',
      format: 'umd'
    },
    plugins: pgl()
  },
  {
    input: 'lib/index.js',
    output: {
      name: 'SelectionRanges',
      file: 'dist/selection-ranges.min.js',
      format: 'umd'
    },
    plugins: pgl([
      uglify()
    ])
  }
];