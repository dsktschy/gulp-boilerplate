'use strict';

const
  gulp = require('gulp'),
  gulpLoadPlugins = require('gulp-load-plugins'),
  conf = require('../../../config'),

  $ = gulpLoadPlugins(),
  plumberOpt = {errorHandler: $.notify.onError('Error: <%= error %>')};

/**
 *  ESLint
 */
gulp.task('js:lint', () => {
  return gulp
    .src(conf.eslint.src)
    .pipe($.plumber(plumberOpt))
    .pipe($.eslint())
    .pipe($.eslint.format())
    .pipe($.eslint.failOnError());
});
