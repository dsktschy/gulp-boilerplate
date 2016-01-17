'use strict';

const
  gulp = require('gulp'),
  gulpLoadPlugins = require('gulp-load-plugins'),
  browserify = require('browserify'),
  babelify = require('babelify'),
  source = require('vinyl-source-stream'),
  buffer = require('vinyl-buffer'),
  conf = require('../config'),
  util = require('../util'),

  $ = gulpLoadPlugins(),
  plumberOpt = {errorHandler: $.notify.onError('Error: <%= error %>')};

/**
 *  ESLint
 */
gulp.task('js:lint', () => {
  return gulp
    .src(conf.eslint.src)
    .pipe($.plumber(plumberOpt))
    .pipe($.eslint())
    .pipe($.eslint.format())
    .pipe($.eslint.failOnError());
});

/**
 *  Browserify(Babelify) + Uglify
 *    onErrorでthis.emitが実行されない場合はwatchが停止する
 *      importするモジュールが存在しない場合など
 */
gulp.task('js:min', ['js:lint'], (done) => {
  let endCount;
  const
    onError = (errorObject) => {
      $.notify.onError(errorObject.toString().split(': ').join(':\n'))
        .apply(this, arguments);
      if (typeof this.emit === 'function') {
        this.emit('end');
      }
    },
    onEnd = () => {
      endCount++;
      if (endCount === conf.browserify.dir.length) {
        done();
      }
    };
  if (!conf.browserify.dir.length) {
    done();
    return;
  }
  endCount = 0;
  for (let dir of conf.browserify.dir) {
    let entryFile, bundledFileName;
    entryFile = `${dir}main.js`;
    if (!util.existsSync(entryFile)) {
      onEnd();
      continue;
    }
    bundledFileName = conf.browserify.dir.length > 1
      ? dir.slice(0, -1).split('/').pop() : 'bundle';
    browserify(entryFile, {debug: conf.debug})
      .transform(babelify)
      .bundle()
      .on('error', onError)
      .pipe($.plumber(plumberOpt))
      .pipe(source(`${bundledFileName}.js`))
      .pipe(buffer())
      .pipe($.if(conf.debug, $.sourcemaps.init({loadMaps: true})))
      .pipe($.uglify({mangle: !conf.debug}))
      .pipe($.rename({suffix: '.min'}))
      .pipe($.if(conf.debug, $.sourcemaps.write(conf.sourcemaps.dst)))
      .pipe(gulp.dest(conf.browserify.dst))
      .on('end', onEnd);
  }
});

/**
 *  JSタスクを一式実行後、リロード
 *    watchから呼ばれるためのタスク。bsInit完了前の単体使用は不可
 */
gulp.task('js:reload', ['js:min'], util.bsReload);
