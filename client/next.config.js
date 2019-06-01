const withPlugins = require('next-compose-plugins')
const withCSS = require('@zeit/next-css')
const withSass = require('@zeit/next-sass')
const webpack = require('webpack')

module.exports = withPlugins([[withCSS], [withSass]], {
  target: 'serverless',
  ssr: true,
  cssModules: true,
  cssLoaderOptions: {
    importLoaders: 1,
    localIdentName: '[local]___[hash:base64:5]'
  },
  webpack(config) {
    config.plugins.push(new webpack.IgnorePlugin(/^electron$/))

    return config
  }
})
