'use strict';

const
  gulp = require('gulp'),
  gulpLoadPlugins = require('gulp-load-plugins'),
  conf = require('../../../config'),
  htmlminifierrc = require('../../../../.htmlminifierrc'),

  $ = gulpLoadPlugins(),
  plumberOpt = {errorHandler: $.notify.onError('Error: <%= error %>')};

/**
 *  HTMLMinifier
 *    無効化した場合はsrcのHTMLをそのままdstにコピー
 *    HTMLのsourcemapは作っても認識されなかった
 */
gulp.task('html:min', ['html:lint'], () => {
  return gulp
    .src(conf.htmlMinifier.src, {base: conf.htmlMinifier.base})
    .pipe($.plumber(plumberOpt))
    .pipe($.if(conf.htmlMinifier.enable, $.htmlMinifier(htmlminifierrc)))
    .pipe(gulp.dest(conf.htmlMinifier.dst));
});
