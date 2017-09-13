const modules = process.env.TESTING ? 'commonjs' : false

module.exports = {
  presets: [
    ['es2015', { modules: modules, loose: true }]
  ]
}
