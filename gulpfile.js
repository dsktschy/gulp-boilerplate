'use strict';

const
  gulp = require('gulp'),
  gulpLoadPlugins = require('gulp-load-plugins'),
  browserify = require('browserify'),
  babelify = require('babelify'),
  source = require('vinyl-source-stream'),
  buffer = require('vinyl-buffer'),
  fs = require('fs'),
  conf = require('./gulp-config'),

  $ = gulpLoadPlugins(),

  /**
   *  ファイルが存在するか確認する
   */
  existsSync = (path) => {
    try {
      fs.accessSync(path);
    } catch (err) {
      console.log(`no such file or directory: ${err.path}`);
      return false;
    }
    return true;
  };

/**
 *  SassLint
 */
gulp.task('css:lint', () => {
  return gulp
    .src(conf.sassLint.src)
    .pipe($.sassLint())
    .pipe($.sassLint.format())
    .pipe($.sassLint.failOnError());
});

/**
 *  ESLint
 */
gulp.task('js:lint', () => {
  return gulp
    .src(conf.eslint.src)
    .pipe($.eslint())
    .pipe($.eslint.format())
    .pipe($.eslint.failOnError());
});

/**
 *  Browserify(Babelify) + Uglify
 */
gulp.task('js:bundle', ['js:lint'], (done) => {
  let endCount;
  const onEnd = () => {
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
    let entryFile, bundledFile;
    entryFile = `${dir}main.js`;
    if (!existsSync(entryFile)) {
      onEnd();
      continue;
    }
    bundledFile = conf.browserify.dir.length > 1
      ? `${dir.slice(0, -1).split('/').pop()}.js`
      : 'bundle.js';
    browserify(entryFile, {debug: conf.debug})
      .transform(babelify)
      .bundle()
      .pipe(source(bundledFile))
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
 *  デフォルトタスク
 */
gulp.task('default', () => {});
