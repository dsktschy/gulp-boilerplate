'use strict';

const
  gulp = require('gulp'),
  gulpLoadPlugins = require('gulp-load-plugins'),
  browserify = require('browserify'),
  babelify = require('babelify'),
  source = require('vinyl-source-stream'),
  conf = require('./gulp-config'),

  $ = gulpLoadPlugins();

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
 *  Browserify(Babelify)
 */
gulp.task('js:bundle', ['js:lint'], () => {
  browserify(`${conf.dir.src}${conf.dir.js}main.js`, {debug: true})
    .transform(babelify)
    .bundle()
    .pipe(source('bundle.js'))
    .pipe(gulp.dest(`${conf.dir.dst}${conf.dir.js}`));
});

/**
 *  デフォルトタスク
 */
gulp.task('default', () => {});
