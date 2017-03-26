'use strict';

const path = require('path');
const dist = 'dist';
const src = 'src';
const test = 'test';
const testkit = 'testkit';
const statics = path.join(dist, 'statics');
const petri = 'petri-specs';
const base = `{app,${src},${test},${testkit}}`;
const watchBase = '{app,src,test,petri-specs}';

module.exports = {
  base: () => base,
  statics: () => statics,
  babel: list => [path.join(list || base, '**', '*.js{,x}'), 'index.js'],
  specs: () => `${base}/**/*.spec.+(js|ts){,x}`,
  e2e: () => `${test}/**/*.e2e.{js,ts}`,
  singleModule: {
    clientDist: () => statics
  },
  multipleModules: {
    clientDist: () => dist
  },
  typescript: list => [`${list || base}/**/*.ts{,x}`],
  tslint: () => [`${base}/**/*.ts{,x}`],
  eslint: () => ['*.js', `${base}/**/*.js`],
  sass: () => `${base}/**/*.scss`,
  less: () => `${base}/**/*.less`,
  watch: () => ['./*.{j,t}s{x,}', `${watchBase}/**/*.*`],
  petri: () => petri,
  petriSpecs: () => path.join(petri, '**', '*.json'),
  petriOutput: () => path.join(statics, 'petri-experiments.json')
};
