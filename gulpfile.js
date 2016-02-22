'use strict';

const
  gulp = require('gulp'),
  requireDir = require('require-dir');

requireDir('./gulp/tasks', {recurse: true});

/**
 *  デフォルトタスク
 */
gulp.task('default', ['html', 'css', 'js', 'image', 'etc']);
