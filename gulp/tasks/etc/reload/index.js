'use strict';

const
  gulp = require('gulp'),
  util = require('../../../util');

/**
 *  HTML,CSS,JS,Image以外に関するタスクを一式実行後、リロード
 *    watchから呼ばれるためのタスク。bsInit完了前の単体使用は不可
 */
gulp.task('etc:reload', ['etc'], util.bsReload);
