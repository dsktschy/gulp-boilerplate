'use strict';

const
  gulp = require('gulp'),
  gulpLoadPlugins = require('gulp-load-plugins'),
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
 *  デフォルトタスク
 */
gulp.task('default', () => {});
