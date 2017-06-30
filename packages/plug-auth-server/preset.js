const modules = process.env.AVA ? 'commonjs' : false

module.exports = {
  presets: [
    ['es2015', { modules: modules, loose: true }]
  ]
}
