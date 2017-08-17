// Grab YOSHI_APP* environment variables and prepare them to be
// injected into the application via DefinePlugin in Webpack configuration.
const YOSHI_APP = /^YOSHI_APP/i;

function getClientEnvironment(debug) {
  const raw = Object.keys(process.env)
    .filter(key => YOSHI_APP.test(key))
    .reduce(
      (env, key) => {
        env[key] = process.env[key];
        return env;
      }, {});
  // Stringify all values so we can feed into Webpack DefinePlugin
  const stringified = Object.keys(raw).reduce((env, key) => {
    env['process.env.' + key] = JSON.stringify(raw[key]);
    return env;
  }, {
    'process.env.NODE_ENV': debug ? '"development"' : '"production"',
    'window.__CI_APP_VERSION__': process.env.ARTIFACT_VERSION ? `"${process.env.ARTIFACT_VERSION}"` : '"0.0.0"'
  });

  return {raw, stringified};
}

module.exports = getClientEnvironment;
