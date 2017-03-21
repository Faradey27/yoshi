'use strict';

const {watchMode, logIfAny} = require('./utils');
const {log, logIf, logIfP} = require('./log');
const {base} = require('./globs');

const watch = watchMode();

module.exports = (plugins, options) => {
  return plugins.reduce((promise, parallel) => {
    return promise.then(() => {
      return Promise.all(parallel.map(task => {
        return require(task)({log, logIf, logIfP, watch, base})(options)
          .catch(error => {
            logIfAny(error);
            if (!watch) {
              process.exit(1);
            }
          });
      }));
    });
  }, Promise.resolve());
};
