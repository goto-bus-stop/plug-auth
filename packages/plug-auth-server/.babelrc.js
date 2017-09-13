const modules = process.env.TESTING ? 'commonjs' : false
const targetVersion = process.env.TESTING ? 'current' : 4

module.exports = {
  presets: [
    ['env', {
      modules: modules,
      loose: true,
      targets: {
        node: targetVersion
      }
    }]
  ]
}
