'use strict';

module.exports = {
  debug: process.env.NODE_ENV !== 'production',
  dir: {
    src: 'src/',
    dst: 'public/',
    css: 'stylesheets/',
    js: 'javascripts/',
    map: 'maps/'
  }
};
