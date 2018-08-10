import commonjs from 'rollup-plugin-commonjs'
import babel from 'rollup-plugin-babel'

const pkg = require('./package.json')

export default {
  input: './src/index.js',
  output: [
    { format: 'cjs', file: pkg.main, exports: 'named' },
    { format: 'esm', file: pkg.module }
  ],
  external: Object.keys(pkg.dependencies),
  plugins: [
    commonjs(),
    babel()
  ]
}
