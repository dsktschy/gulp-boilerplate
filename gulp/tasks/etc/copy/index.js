'use strict';

const
  gulp = require('gulp'),
  gulpLoadPlugins = require('gulp-load-plugins'),
  conf = require('../../../config'),

  $ = gulpLoadPlugins(),
  plumberOpt = {errorHandler: $.notify.onError('Error: <%= error %>')};

/**
 *  Copy
 */
gulp.task('etc:copy', () => {
  return gulp
    .src(conf.copy.src, {base: conf.copy.base})
    .pipe($.plumber(plumberOpt))
    .pipe(gulp.dest(conf.copy.dst));
});
