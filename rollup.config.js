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

export default [
  {
    input: 'lib/index.js',
    output: [
      { file: pkg.exports['.'], format: 'es', sourcemap: true }
    ],
    plugins: pgl()
  }
];