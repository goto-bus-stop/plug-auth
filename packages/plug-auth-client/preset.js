const modules = process.env.AVA ? 'commonjs' : false

module.exports = {
  presets: [
    ['es2015', { loose: true, modules: modules }]
  ],
  plugins: [
    ['fast-async', {
      compiler: { noRuntime: true }
    }]
  ]
}
