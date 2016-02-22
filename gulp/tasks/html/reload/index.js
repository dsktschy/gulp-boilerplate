'use strict';

const
  gulp = require('gulp'),
  util = require('../../../util');

/**
 *  HTMLタスクを一式実行後、リロード
 *    watchから呼ばれるためのタスク。bsInit完了前の単体使用は不可
 */
gulp.task('html:reload', ['html'], util.bsReload);
