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
  htmlminifierrc = require('./.htmlminifierrc'),

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
 *  HTMLHint
 */
gulp.task('html:lint', () => {
  return gulp
    .src(conf.htmlhint.src)
    .pipe($.htmlhint('.htmlhintrc'))
    .pipe($.htmlhint.reporter())
    .pipe($.htmlhint.failReporter());
});

/**
 *  HTMLMinifier
 *    無効化した場合はsrcのHTMLをそのままdstにコピー
 *    HTMLのsourcemapは作れなかった
 */
gulp.task('html:minify', ['html:lint'], () => {
  return gulp
    .src(conf.htmlMinifier.src, {base: conf.htmlMinifier.base})
    .pipe($.if(conf.htmlMinifier.enable, $.htmlMinifier(htmlminifierrc)))
    .pipe(gulp.dest(conf.htmlMinifier.dst));
});

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
 *  Sass + Pleeease
 */
gulp.task('css:bundle', ['css:lint'], (done) => {
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
    entryFile = `${dir}main.scss`;
    if (!existsSync(entryFile)) {
      onEnd();
      continue;
    }
    bundledFileName = conf.sass.dir.length > 1
      ? dir.slice(0, -1).split('/').pop() : 'bundle';
    gulp
      .src(entryFile)
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
    let entryFile, bundledFileName;
    entryFile = `${dir}main.js`;
    if (!existsSync(entryFile)) {
      onEnd();
      continue;
    }
    bundledFileName = conf.browserify.dir.length > 1
      ? dir.slice(0, -1).split('/').pop() : 'bundle';
    browserify(entryFile, {debug: conf.debug})
      .transform(babelify)
      .bundle()
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
 *  デフォルトタスク
 */
gulp.task('default', () => {});
