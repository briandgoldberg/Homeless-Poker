const withPlugins = require('next-compose-plugins')
const withSass = require('@zeit/next-sass')
// const webpack = require('webpack')

module.exports = withPlugins([[withSass]], {
  target: 'serverless', // activate for `yarn now`
  ssr: true,
  cssModules: true,
  cssLoaderOptions: {
    importLoaders: 1,
    localIdentName: '[local]___[hash:base64:5]',
    reloadAll: true
  }
})
