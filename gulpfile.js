'use strict';

require('./gulp/tasks/html');
require('./gulp/tasks/css');
require('./gulp/tasks/js');
require('./gulp/tasks/image');
require('./gulp/tasks/watch');

const gulp = require('gulp');

/**
 *  デフォルトタスク
 */
gulp.task('default', () => {});
