'use strict';

const
  gulp = require('gulp'),
  gulpLoadPlugins = require('gulp-load-plugins'),
  conf = require('../config'),
  util = require('../util'),
  htmlminifierrc = require('../../.htmlminifierrc'),

  $ = gulpLoadPlugins(),
  plumberOpt = {errorHandler: $.notify.onError('Error: <%= error %>')};

/**
 *  HTMLHint
 */
gulp.task('html:lint', () => {
  return gulp
    .src(conf.htmlhint.src)
    .pipe($.plumber(plumberOpt))
    .pipe($.htmlhint('.htmlhintrc'))
    .pipe($.htmlhint.reporter())
    .pipe($.htmlhint.failReporter());
});

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

/**
 *  HTMLタスクを一式実行後、リロード
 *    watchから呼ばれるためのタスク。bsInit完了前の単体使用は不可
 */
gulp.task('html:reload', ['html:min'], util.bsReload);
