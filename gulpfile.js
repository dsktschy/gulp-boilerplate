'use strict';

require('./gulp/tasks/html');
require('./gulp/tasks/html/lint');
require('./gulp/tasks/html/min');
require('./gulp/tasks/html/reload');
require('./gulp/tasks/css');
require('./gulp/tasks/css/lint');
require('./gulp/tasks/css/min');
require('./gulp/tasks/css/reload');
require('./gulp/tasks/js');
require('./gulp/tasks/js/lint');
require('./gulp/tasks/js/min');
require('./gulp/tasks/js/reload');
require('./gulp/tasks/image');
require('./gulp/tasks/image/min');
require('./gulp/tasks/image/reload');
require('./gulp/tasks/etc');
require('./gulp/tasks/etc/copy');
require('./gulp/tasks/etc/reload');
require('./gulp/tasks/watch');

const gulp = require('gulp');

/**
 *  デフォルトタスク
 */
gulp.task('default', ['html', 'css', 'js', 'image', 'etc']);
