'use strict';

const dir = {
  src: 'src/',
  dst: 'public/',
  css: 'stylesheets/',
  js: 'javascripts/',
  map: 'maps/'
};

module.exports = {
  debug: process.env.NODE_ENV !== 'production',
  dir,
  htmlhint: {
    src: [`${dir.dst}**/*.html`]
  },
  sassLint: {
    src: [`${dir.src}${dir.css}**/*.scss`]
  },
  sass: {
    // エントリーファイルが格納されたディレクトリ。末尾'/'必須
    // 複数指定することでディレクトリ毎にバンドルファイルを生成可能
    dir: [`${dir.src}${dir.css}`],
    dst: `${dir.dst}${dir.css}`
  },
  eslint: {
    src: [
      `${dir.src}${dir.js}**/*.js`,
      'gulpfile.js',
      'gulp-config.js'
    ]
  },
  browserify: {
    // エントリーファイルが格納されたディレクトリ。末尾'/'必須
    // 複数指定することでディレクトリ毎にバンドルファイルを生成可能
    dir: [`${dir.src}${dir.js}`],
    dst: `${dir.dst}${dir.js}`
  },
  sourcemaps: {
    // bundleファイルを起点とするパス
    dst: `../${dir.map}`,
    // ブラウザのインスペクタの表示上mapが格納されるディレクトリ
    sourceRoot: {
      // JSはbrowserifyのデフォルト設定を引き継ぐため、CSSもそれに揃えて設定する
      css: `/source/${dir.src}${dir.css}`
    }
  }
};
