'use strict';

const
  gulp = require('gulp'),
  util = require('../../../util');

/**
 *  CSSタスクを一式実行後、リロード
 *    watchから呼ばれるためのタスク。bsInit完了前の単体使用は不可
 */
gulp.task('css:reload', ['css'], util.bsReload);
