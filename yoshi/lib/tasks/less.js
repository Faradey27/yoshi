'use strict';

const fs = require('fs');
const path = require('path');
const lessModule = require('less');
const gulp = require('gulp');
const globs = require('../globs');
const {watchMode, readDir, writeFile} = require('../utils');
const {logIf} = require('../log');

const watch = watchMode();

function less() {
  const glob = globs.less();

  if (watch) {
    gulp.watch(glob, () => transpile(glob));
  }

  return transpile(glob);
}

function readGlob(glob) {
    return readDir(glob).filter(file => path.basename(file)[0] !== '_');
}

function transpile(glob) {
    return Promise.all(readGlob(glob).map(renderFile));
}

function renderFile(file) {
  const options = {
    paths: ['.', 'node_modules', path.dirname(file)],
    filename: path.basename(file),
  };

  // @import "~foo/bar"; should import "node_modules/foo/bar.less".
  // this syntax is required by the less webpack loader. When using
  // this task for transpiling, dropping the ~.

  const fileContent = fs.readFileSync(file, 'utf-8')
    .replace(/(^@import.*)(~)/gm, '$1');

  return new Promise((resolve, reject) => {
    lessModule.render(fileContent, options, (err, result) => {
      if (err) {
        reject(`[${err.filename}] ${err.message}`);
      } else {
        writeFile(path.resolve('dist', file), result.css);
        resolve(result);
      }
    });
  });
}

module.exports = logIf(less, () => readGlob(globs.less()).length > 0);
