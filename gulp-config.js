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
  eslint: {
    src: [
      `${dir.src}${dir.js}**/*.js`,
      'gulpfile.js',
      'gulp-config.js'
    ]
  },
  browserify: {
    entry: `${dir.src}${dir.js}main.js`,
    dst: `${dir.dst}${dir.js}`
  },
  sourcemaps: {
    // bundleファイルを起点とするパス
    dst: `../${dir.map}`
  }
};
