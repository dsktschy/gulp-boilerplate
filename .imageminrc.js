'use strict';

const pngquant = require('imagemin-pngquant');

module.exports = {
  progressive: true,
  use: [pngquant()]
};
