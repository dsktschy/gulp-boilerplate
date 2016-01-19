'use strict';

const
  gulp = require('gulp'),
  gulpLoadPlugins = require('gulp-load-plugins'),
  conf = require('../config'),
  util = require('../util'),

  $ = gulpLoadPlugins(),
  plumberOpt = {errorHandler: $.notify.onError('Error: <%= error %>')};

/**
 *  SassLint
 *    一部watchが停止するケースがある
 *      @importの@が抜けている場合など
 */
gulp.task('css:lint', () => {
  return gulp
    .src(conf.sassLint.src)
    .pipe($.plumber(plumberOpt))
    .pipe($.sassLint())
    .pipe($.sassLint.format())
    .pipe($.sassLint.failOnError());
});

/**
 *  Sass + Pleeease
 */
gulp.task('css:min', ['css:lint'], (done) => {
  let endCount;
  const onEnd = () => {
    endCount++;
    if (endCount === conf.sass.dir.length) {
      done();
    }
  };
  if (!conf.sass.dir.length) {
    done();
    return;
  }
  endCount = 0;
  for (let dir of conf.sass.dir) {
    let entryFile, bundledFileName;
    entryFile = dir + conf.sass.entry;
    if (!util.existsSync(entryFile)) {
      onEnd();
      continue;
    }
    bundledFileName = conf.sass.dir.length > 1
      ? dir.slice(0, -1).split('/').pop() : 'bundle';
    gulp
      .src(entryFile)
      .pipe($.plumber(plumberOpt))
      .pipe($.if(conf.debug, $.sourcemaps.init({loadMaps: true})))
      .pipe($.sass())
      .pipe($.pleeease({
        autoprefixer: true,
        rem: true,
        minifier: true,
        out: `${bundledFileName}.min.css`
      }))
      .pipe($.if(conf.debug, $.sourcemaps.write(conf.sourcemaps.dst, {
        sourceRoot: conf.sourcemaps.sourceRoot.css
      })))
      .pipe(gulp.dest(conf.sass.dst))
      .on('end', onEnd);
  }
});

/**
 *  CSSタスクを一式実行後、リロード
 *    watchから呼ばれるためのタスク。bsInit完了前の単体使用は不可
 */
gulp.task('css:reload', ['css:min'], util.bsReload);
