'use strict';

const
  gulp = require('gulp'),
  util = require('../../../util');

/**
 *  Imageタスクを一式実行後、リロード
 *    watchから呼ばれるためのタスク。bsInit完了前の単体使用は不可
 */
gulp.task('image:reload', ['image'], util.bsReload);
