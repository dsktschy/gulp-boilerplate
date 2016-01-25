'use strict';

const
  dir = {
    src: 'src/',
    dst: 'public/',
    gulp: 'gulp/',
    css: 'stylesheets/',
    js: 'javascripts/',
    img: 'images/',
    map: 'maps/'
  },
  file = {
    index: 'index',
    entry: 'entry'
  };

module.exports = {
  debug: process.env.NODE_ENV !== 'production',
  dir,
  file,
  htmlhint: {
    src: [`${dir.src}**/*.html`]
  },
  htmlMinifier: {
    enable: true,
    base: dir.src,
    src: [`${dir.src}**/*.html`],
    dst: dir.dst
  },
  sassLint: {
    src: [`${dir.src}${dir.css}**/*.scss`]
  },
  sass: {
    entry: `${file.entry}.scss`,
    // エントリーファイルが格納されたディレクトリ。末尾'/'必須
    // 複数指定することでディレクトリ毎にバンドルファイルを生成可能
    dir: [dir.src + dir.css],
    dst: dir.dst + dir.css
  },
  eslint: {
    src: [
      `${dir.src}${dir.js}**/*.js`,
      'gulpfile.js',
      `${dir.gulp}**/*.js`
    ]
  },
  browserify: {
    entry: `${file.entry}.js`,
    // エントリーファイルが格納されたディレクトリ。末尾'/'必須
    // 複数指定することでディレクトリ毎にバンドルファイルを生成可能
    dir: [dir.src + dir.js],
    dst: dir.dst + dir.js
  },
  imagemin: {
    enable: true,
    base: dir.src + dir.img,
    src: [`${dir.src}${dir.img}**/*`],
    dst: dir.dst + dir.img
  },
  copy: {
    base: dir.src,
    src: [`${dir.src}favicon.ico`],
    dst: dir.dst
  },
  sourcemaps: {
    // bundleファイルを起点とするパス
    dst: `../${dir.map}`,
    // ブラウザのインスペクタの表示上mapが格納されるディレクトリ
    sourceRoot: {
      // JSはbrowserifyのデフォルト設定を引き継ぐため、CSSもそれに揃えて設定する
      css: `/source/${dir.src}${dir.css}`
    }
  },
  browserSync: {
    index: `${dir.dst}${file.index}.html`,
    opt: {
      server: {
        baseDir: dir.dst,
        index: `${file.index}.html`
      },
      open: false
    }
  },
  watch: {
    target: {
      html: [`${dir.src}**/*.html`],
      css: [`${dir.src}${dir.css}**/*.scss`],
      js: [`${dir.src}${dir.js}**/*.js`],
      img: [`${dir.src}${dir.img}**/*`],
      etc: [`${dir.src}favicon.ico`]
    }
  }
};
