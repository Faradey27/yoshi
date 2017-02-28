'use strict';

const run = require('../../run');
const clean = require('../clean');
const sass = require('../sass');
const transpile = require('../transpile');
const updateNodeVersion = require('../update-node-version');
const petri = require('../petri');
const targz = require('../targz');
const bundle = require('../bundle');
const copyAssets = require('../copy-assets');

function build(options) {
  const runWithOptions = run(options);

  return runWithOptions(clean, updateNodeVersion)
    .then(() => runWithOptions(sass, petri, targz, copyAssets, transpile, bundle));
}

module.exports = build;
