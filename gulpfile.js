const gulp = require('gulp')
const del = require('del')
const babel = require('gulp-babel')
const watch = require('gulp-watch')
const plumber = require('gulp-plumber')
const newer = require('gulp-newer')
const uglify = require('gulp-uglify')
const rename = require('gulp-rename')
const through = require('through2')
const log = require('gulp-util').log
const colors = require('gulp-util').colors
const relative = require('path').relative

const rollup = require('rollup').rollup
const rollupBabel = require('rollup-plugin-babel')
const rollupNodeResolve = require('rollup-plugin-node-resolve')
const rollupCommonjs = require('rollup-plugin-commonjs')

const src = {
  client: 'packages/plug-auth-client/src',
  server: 'packages/plug-auth-server/src'
}
const dest = {
  client: 'packages/plug-auth-client',
  server: 'packages/plug-auth-server/lib'
}

gulp.task('clean', () => del('client', 'server', 'dist'))

const logCompiling = () => through.obj((file, enc, cb) => {
  const path = relative(__dirname, file.path)
  log(`Compiling '${colors.cyan(path)}'...`)
  cb(null, file)
})

gulp.task('build:client', () =>
  rollup({
    entry: `./${src.client}/index.js`,
    plugins: [
      rollupBabel(),
      rollupNodeResolve({
        jsnext: true,
        main: true
      }),
      rollupCommonjs()
    ]
  }).then(bundle => Promise.all([
    bundle.write({
      format: 'amd',
      dest: `${dest.client}/rollup.amd.js`
    }),
    bundle.write({
      format: 'cjs',
      dest: `${dest.client}/rollup.cjs.js`
    }),
    bundle.write({
      format: 'es',
      dest: `${dest.client}/rollup.es.js`
    }),
    bundle.write({
      format: 'umd',
      dest: `${dest.client}/rollup.js`,
      moduleName: 'plugAuth'
    })
  ]))
)

gulp.task('build:server', () =>
  gulp.src(`${src.server}/**/*.js`)
    .pipe(newer(dest.server))
    .pipe(logCompiling())
    .pipe(plumber())
    .pipe(babel())
    .pipe(gulp.dest(dest.server))
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
      compress: {
        screw_ie8: true,
        pure_getters: true,
        unsafe: true
      },
      output: { screw_ie8: true },
      mangle: { toplevel: true }
    }))
    .pipe(rename('rollup.min.js'))
    .pipe(gulp.dest(dest.client))
)

gulp.task('default', ['build', 'build:dist'])
