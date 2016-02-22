'use strict';

const
  gulp = require('gulp'),
  gulpLoadPlugins = require('gulp-load-plugins'),
  conf = require('../../../config'),

  $ = gulpLoadPlugins(),
  plumberOpt = {errorHandler: $.notify.onError('Error: <%= error %>')};

/**
 *  SassLint
 *    一部watchが停止するケースがある
 *      @importの@が抜けている場合など
 */
gulp.task('css:lint', () => {
  return gulp
    .src(conf.sassLint.src)
    .pipe($.plumber(plumberOpt))
    .pipe($.sassLint())
    .pipe($.sassLint.format())
    .pipe($.sassLint.failOnError());
});
