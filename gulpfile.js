'use strict';

const
  gulp = require('gulp'),
  gulpLoadPlugins = require('gulp-load-plugins'),
  browserify = require('browserify'),
  babelify = require('babelify'),
  source = require('vinyl-source-stream'),
  buffer = require('vinyl-buffer'),
  del = require('del'),
  fs = require('fs'),
  conf = require('./gulp-config'),

  $ = gulpLoadPlugins(),

  /**
   *  ファイルが存在するか確認する
   */
  existsSync = (path) => {
    try {
      fs.accessSync(path);
    } catch (err) {
      console.log(`no such file or directory: ${err.path}`);
      return false;
    }
    return true;
  };

/**
 *  ESLint
 */
gulp.task('js:lint', () => {
  return gulp
    .src([
      `${conf.dir.src}${conf.dir.js}**/*.js`,
      'gulpfile.js'
    ])
    .pipe($.eslint())
    .pipe($.eslint.format())
    .pipe($.eslint.failOnError());
});

/**
 *  Browserify(Babelify) + Uglify
 */
gulp.task('js:bundle', ['js:lint'], (done) => {
  const entryFile = `${conf.dir.src}${conf.dir.js}main.js`;
  if (!existsSync(entryFile)) {
    done();
    return;
  }
  return browserify(entryFile, {debug: conf.debug})
    .transform(babelify)
    .bundle()
    .pipe(source('bundle.js'))
    .pipe(buffer())
    .pipe($.if(conf.debug, $.sourcemaps.init({loadMaps: true})))
    .pipe($.uglify({mangle: !conf.debug}))
    .pipe($.rename({suffix: '.min'}))
    .pipe($.if(conf.debug, $.sourcemaps.write(`../${conf.dir.map}`)))
    .pipe(gulp.dest(`${conf.dir.dst}${conf.dir.js}`));
});

/**
 *  minify前のjsを削除
 */
gulp.task('js:clean', ['js:bundle'], () => {
  return del([
    `${conf.dir.dst}${conf.dir.js}**/*.js`,
    `!${conf.dir.dst}${conf.dir.js}**/*.min.js`
  ], (err, paths) => {
    if (err) {
      console.log(err, paths);
    }
  });
});

/**
 *  デフォルトタスク
 */
gulp.task('default', () => {});
