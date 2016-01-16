'use strict';

const
  gulp = require('gulp'),
  gulpLoadPlugins = require('gulp-load-plugins'),
  browserify = require('browserify'),
  babelify = require('babelify'),
  source = require('vinyl-source-stream'),
  buffer = require('vinyl-buffer'),
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
    .src(conf.eslint.src)
    .pipe($.eslint())
    .pipe($.eslint.format())
    .pipe($.eslint.failOnError());
});

/**
 *  Browserify(Babelify) + Uglify
 */
gulp.task('js:bundle', ['js:lint'], (done) => {
  if (!existsSync(conf.browserify.entry)) {
    done();
    return;
  }
  return browserify(conf.browserify.entry, {debug: conf.debug})
    .transform(babelify)
    .bundle()
    .pipe(source('bundle.js'))
    .pipe(buffer())
    .pipe($.if(conf.debug, $.sourcemaps.init({loadMaps: true})))
    .pipe($.uglify({mangle: !conf.debug}))
    .pipe($.rename({suffix: '.min'}))
    .pipe($.if(conf.debug, $.sourcemaps.write(conf.sourcemaps.dst)))
    .pipe(gulp.dest(conf.browserify.dst));
});

/**
 *  デフォルトタスク
 */
gulp.task('default', () => {});
