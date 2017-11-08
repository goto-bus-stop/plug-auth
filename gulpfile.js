const gulp = require('gulp')
const del = require('del')
const watch = require('gulp-watch')
const uglify = require('gulp-uglify')
const rename = require('gulp-rename')
const rollup = require('rollup').rollup
const rollupBabel = require('rollup-plugin-babel')
const rollupNodeResolve = require('rollup-plugin-node-resolve')
const rollupCommonjs = require('rollup-plugin-commonjs')
const serverMeta = require('./packages/plug-auth-server/package.json')

const src = {
  client: 'packages/plug-auth-client/src',
  server: 'packages/plug-auth-server/src'
}
const dest = {
  client: 'packages/plug-auth-client',
  server: 'packages/plug-auth-server'
}

gulp.task('clean', () => del(`${dest.client}/rollup*.js`, `${dest.server}/index.js`))

gulp.task('build:client', () =>
  rollup({
    input: `./${src.client}/index.js`,
    plugins: [
      rollupCommonjs(),
      rollupBabel(),
      rollupNodeResolve({
        jsnext: true,
        main: true
      })
    ]
  }).then(bundle => Promise.all([
    bundle.write({
      format: 'amd',
      file: `${dest.client}/rollup.amd.js`
    }),
    bundle.write({
      format: 'cjs',
      file: `${dest.client}/rollup.cjs.js`
    }),
    bundle.write({
      format: 'es',
      file: `${dest.client}/rollup.es.js`
    }),
    bundle.write({
      format: 'umd',
      file: `${dest.client}/rollup.js`,
      name: 'plugAuth'
    })
  ]))
)

gulp.task('build:server', () =>
  rollup({
    input: `./${src.server}/index.js`,
    external: Object.keys(serverMeta.dependencies),
    plugins: [
      rollupBabel(),
      rollupCommonjs()
    ]
  }).then((bundle) => bundle.write({
    format: 'cjs',
    file: `${dest.server}/index.js`
  }))
)

gulp.task('build', ['build:client', 'build:server'])

gulp.task('watch', () => {
  watch(`${src.client}/**/*.js`, () => {
    gulp.start('build:client')
  })
  watch(`${src.server}/**/*.js`, () => {
    gulp.start('build:server')
  })
})

gulp.task('build:dist', ['build:client'], () =>
  gulp.src(`${dest.client}/rollup.js`)
    .pipe(uglify({
      toplevel: true,
      compress: {
        pure_getters: true,
        unsafe: true
      }
    }))
    .pipe(rename('rollup.min.js'))
    .pipe(gulp.dest(dest.client))
)

gulp.task('default', ['build', 'build:dist'])
