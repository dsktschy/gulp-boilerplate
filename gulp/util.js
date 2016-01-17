'use strict';

let bsSkip;

const
  fs = require('fs'),
  browserSync = require('browser-sync'),
  conf = require('./config'),

  bs = browserSync.create(),

  /**
   *  ファイルが存在するか確認する
   *  @exports
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
   *  BrowserSync初期化
   *  @exports
   */
  bsInit = () => {
    if (existsSync(conf.browserSync.index)) {
      bsSkip = false;
      bs.init(conf.browserSync.opt);
    } else {
      bsSkip = true;
    }
  },

  /**
   *  BrowserSyncリロード
   *    taskのコールバックにbs.reloadをそのまま渡すとタスクが完了せず
   *    以降のタスク呼び出しが無効となるため関数で包む
   *  @exports
   */
  bsReload = () => {
    if (bsSkip) {
      return;
    }
    bs.reload();
  };

module.exports = {
  existsSync,
  bsInit,
  bsReload
};
