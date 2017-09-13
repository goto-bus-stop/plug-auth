const modules = process.env.TESTING ? 'commonjs' : false

module.exports = {
  presets: [
    ['env', {
      loose: true,
      modules: modules,
      forceAllTransforms: true
    }]
  ]
}
