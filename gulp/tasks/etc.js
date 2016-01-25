'use strict';

const
  gulp = require('gulp'),
  gulpLoadPlugins = require('gulp-load-plugins'),
  conf = require('../config'),
  util = require('../util'),

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

/**
 *  コピー実行後、リロード
 *    watchから呼ばれるためのタスク。bsInit完了前の単体使用は不可
 */
gulp.task('etc:reload', ['etc:copy'], util.bsReload);
