const fs = require('fs')
const spawn = require('child_process').spawnSync
const join = require('path').join
const version = process.env.npm_package_version

function bump(name, version) {
  const path = join(__dirname, 'packages', name, 'package.json')
  const pkg = JSON.parse(fs.readFileSync(path, 'utf8'))
  pkg.version = version
  fs.writeFileSync(path, JSON.stringify(pkg, null, 2) + '\n', 'utf8')
  spawn('git', ['add', path])
}

bump('plug-auth-client', version)
bump('plug-auth-server', version)
