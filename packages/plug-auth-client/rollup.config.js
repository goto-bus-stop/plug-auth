import commonjs from 'rollup-plugin-commonjs'
import babel from 'rollup-plugin-babel'
import resolve from 'rollup-plugin-node-resolve'
import { minify } from 'terser'

const pkg = require('./package.json')

export default {
  input: './src/index.js',
  output: [
    { file: pkg.main, format: 'cjs' },
    { file: pkg.module, format: 'esm' },
    { file: pkg.unpkg, name: 'plugAuth', format: 'umd' },
    { file: `./dist/${pkg.name}.amd.js`, format: 'amd' }
  ],
  plugins: [
    commonjs(),
    babel(),
    resolve(),
    {
      renderChunk (source, _, options) {
        if (options.format !== 'umd') return null
        return minify(source)
      }
    }
  ]
}
