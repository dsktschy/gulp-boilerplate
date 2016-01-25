'use strict';

const
  gulp = require('gulp'),
  conf = require('../config'),
  util = require('../util');

/**
 *  それぞれのファイル形式のタスクを一式実行後、監視に入る
 */
gulp.task('watch', ['html:min', 'css:min', 'js:min', 'image:min', 'etc:copy'], () => {
  util.bsInit();
  gulp.watch(conf.watch.target.html, ['html:reload']);
  gulp.watch(conf.watch.target.css, ['css:reload']);
  gulp.watch(conf.watch.target.js, ['js:reload']);
  gulp.watch(conf.watch.target.img, ['image:reload']);
  gulp.watch(conf.watch.target.etc, ['etc:reload']);
});
