const modules = process.env.TESTING ? 'commonjs' : false

module.exports = {
  presets: [
    ['@babel/env', {
      loose: true,
      modules: modules,
      forceAllTransforms: true
    }]
  ]
}
