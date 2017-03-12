'use strict';

const path = require('path');
const gulp = require('gulp');
const spawn = require('cross-spawn');
const {watchMode} = require('../utils');
const projectConfig = require('../../config/project');
const globs = require('../globs');
const {inTeamCity} = require('../utils');
const {log} = require('../log');

const watch = watchMode();
const files = projectConfig.specs.node() || globs.specs();

const mochaBin = path.join('mocha', 'bin', 'mocha');
const env = Object.assign(process.env, {NODE_ENV: 'test', SRC_PATH: './src'});
const options = {cwd: process.cwd(), env, stdio: 'inherit'};
const args = {
  reporter: inTeamCity() ? 'mocha-teamcity-reporter' : projectConfig.mochaReporter(),
  timeout: 30000,
  recursive: true,
  require: [absolute('require-hooks'), absolute('setup', 'mocha-setup')]
};

module.exports = log(mocha);

function mocha() {
  if (watch) {
    gulp.watch(`${globs.base()}/**/*`, runMocha);
  }

  return runMocha();
}

function runMocha() {
  return new Promise((resolve, reject) => {
    const proc = spawn('node', [require.resolve(mochaBin), ...toCliArgs(args), files], options);
    proc.on('close', code => code ? reject() : resolve());
  });
}

function absolute(...a) {
  return path.join(__dirname, '..', ...a);
}

function toCliArgs(args) {
  return Object.keys(args).reduce((result, name) => {
    return [...result, ...decorate(args[name], name)];
  }, []);
}

function decorate(value, name) {
  return []
    .concat(value)
    .map(val => [`--${name}`].concat(val === true ? [] : String(val)))
    .reduce((acc, val) => [...acc, ...val], []);
}
