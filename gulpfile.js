'use strict';

let bsSkip;

const
  gulp = require('gulp'),
  gulpLoadPlugins = require('gulp-load-plugins'),
  browserify = require('browserify'),
  babelify = require('babelify'),
  source = require('vinyl-source-stream'),
  buffer = require('vinyl-buffer'),
  fs = require('fs'),
  browserSync = require('browser-sync'),
  conf = require('./gulp-config'),
  htmlminifierrc = require('./.htmlminifierrc'),
  imageminrc = require('./.imageminrc'),

  $ = gulpLoadPlugins(),
  plumberOpt = {errorHandler: $.notify.onError('Error: <%= error %>')},
  bs = browserSync.create(),

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
  },

  /**
   *  BrowserSyncリロード
   *    taskのコールバックにbs.reloadをそのまま渡すとタスクが完了せず
   *    以降のタスク呼び出しが無効となるため関数で包む
   */
  bsReload = () => {
    if (bsSkip) {
      return;
    }
    bs.reload();
  };

/**
 *  HTMLHint
 */
gulp.task('html:lint', () => {
  return gulp
    .src(conf.htmlhint.src)
    .pipe($.plumber(plumberOpt))
    .pipe($.htmlhint('.htmlhintrc'))
    .pipe($.htmlhint.reporter())
    .pipe($.htmlhint.failReporter());
});

/**
 *  HTMLMinifier
 *    無効化した場合はsrcのHTMLをそのままdstにコピー
 *    HTMLのsourcemapは作れなかった
 */
gulp.task('html:min', ['html:lint'], () => {
  return gulp
    .src(conf.htmlMinifier.src, {base: conf.htmlMinifier.base})
    .pipe($.plumber(plumberOpt))
    .pipe($.if(conf.htmlMinifier.enable, $.htmlMinifier(htmlminifierrc)))
    .pipe(gulp.dest(conf.htmlMinifier.dst));
});

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
    entryFile = `${dir}main.scss`;
    if (!existsSync(entryFile)) {
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
    if (!existsSync(entryFile)) {
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
 *  ImageMin
 */
gulp.task('image:min', () => {
  return gulp
    .src(conf.imagemin.src, {base: conf.imagemin.base})
    .pipe($.plumber(plumberOpt))
    .pipe($.if(conf.imagemin.enable, $.imagemin(imageminrc)))
    .pipe(gulp.dest(conf.imagemin.dst));
});

/**
 *  それぞれのファイル形式のタスクを一式実行後、リロード
 *    watchから呼ばれるためのタスク。bsInit完了前の単体使用は不可
 */
gulp.task('html:reload', ['html:min'], bsReload);
gulp.task('css:reload', ['css:min'], bsReload);
gulp.task('js:reload', ['js:min'], bsReload);
gulp.task('image:reload', ['image:min'], bsReload);

/**
 *  それぞれのファイル形式のタスクを一式実行後、監視に入る
 */
gulp.task('watch', ['html:min', 'css:min', 'js:min', 'image:min'], () => {
  if (existsSync(conf.browserSync.index)) {
    bsSkip = false;
    bs.init(conf.browserSync.opt);
  } else {
    bsSkip = true;
  }
  gulp.watch(conf.watch.target.html, ['html:reload']);
  gulp.watch(conf.watch.target.css, ['css:reload']);
  gulp.watch(conf.watch.target.js, ['js:reload']);
  gulp.watch(conf.watch.target.img, ['image:reload']);
});

/**
 *  デフォルトタスク
 */
gulp.task('default', () => {});
