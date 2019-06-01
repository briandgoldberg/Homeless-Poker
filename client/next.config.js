const withPlugins = require('next-compose-plugins')
const withSass = require('@zeit/next-sass')
// const webpack = require('webpack')

module.exports = withPlugins([[withSass]], {
  // target: 'serverless',
  cssModules: true,
  cssLoaderOptions: {
    importLoaders: 1,
    // includePaths: ['./components/'],
    localIdentName: '[local]___[hash:base64:5]'
    // hmr: process.env.NODE_ENV === 'development',
    // // if hmr does not work, this is a forceful method.
    // reloadAll: true
  }
  // webpack(config) {
  //   config.plugins.push(new webpack.IgnorePlugin(/^electron$/))
  //   return config
  // }
})
