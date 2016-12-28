const fs = require('fs')
const join = require('path').join
const version = require('./package.json').version

function bump(name, version) {
  const path = join(__dirname, 'packages', name, 'package.json')
  const pkg = JSON.parse(fs.readFileSync(path, 'utf8'))
  pkg.version = version
  fs.writeFileSync(path, JSON.stringify(pkg, null, 2) + '\n', 'utf8')
}

bump('plug-auth-client', version)
bump('plug-auth-server', version)
