'use strict';

const
  gulp = require('gulp'),
  gulpLoadPlugins = require('gulp-load-plugins'),
  conf = require('../../../config'),
  imageminrc = require('../../../../.imageminrc'),

  $ = gulpLoadPlugins(),
  plumberOpt = {errorHandler: $.notify.onError('Error: <%= error %>')};

/**
 *  ImageMin
 */
gulp.task('image:min', () => {
  return gulp
    .src(conf.imagemin.src, {base: conf.imagemin.base})
    .pipe($.plumber(plumberOpt))
    .pipe($.if(conf.imagemin.enable, $.imagemin(imageminrc)))
    .pipe(gulp.dest(conf.imagemin.dst));
});
