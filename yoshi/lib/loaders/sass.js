'use strict';

module.exports = (extractCSS, cssModules, tpaStyle) => {
  const cssLoaderOptions = {
    modules: cssModules,
    camelCase: true,
    sourceMap: !!extractCSS,
    localIdentName: '[path][name]__[local]__[hash:base64:5]',
    importLoaders: tpaStyle ? 3 : 2
  };

  const sassLoaderOptions = {
    sourceMap: true,
    includePaths: ['.', 'node_modules', 'node_modules/compass-mixins/lib']
  };

  return {
    client: {
      test: /\.s?css$/,
      exclude: /\.raw\.css$/,
      loader: clientLoader(extractCSS, 'style', [
        `css-loader?${JSON.stringify(cssLoaderOptions)}`,
        'postcss',
        ...tpaStyle ? ['wix-tpa-style-loader'] : [],
        `sass?${JSON.stringify(sassLoaderOptions)}`
      ])
    },
    specs: {
      test: /\.s?css$/,
      exclude: /\.raw\.css$/,
      loaders: [
        `css-loader/locals?${JSON.stringify(cssLoaderOptions)}`,
        ...tpaStyle ? ['wix-tpa-style-loader'] : [],
        `sass?${JSON.stringify(sassLoaderOptions)}`
      ]
    }
  };
};

function clientLoader(extractCSS, l1, l2) {
  return extractCSS ? extractCSS.extract(l1, l2) : [l1].concat(l2).join('!');
}
