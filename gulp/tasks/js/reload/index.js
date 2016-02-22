'use strict';

const
  gulp = require('gulp'),
  util = require('../../../util');

/**
 *  JSタスクを一式実行後、リロード
 *    watchから呼ばれるためのタスク。bsInit完了前の単体使用は不可
 */
gulp.task('js:reload', ['js'], util.bsReload);
