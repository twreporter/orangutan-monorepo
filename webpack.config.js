const merge = require('webpack-merge')
const baseConfig = require('./webpack.base.config.js')

const packages = {
  scrollableImage: 'scrollable-image',
}

const config = {
  entry: {
    [`${packages.scrollableImage}/main`]: './packages/scrollable-image/src/components/scrollable-image.js',
  },
}

module.exports = merge(baseConfig, config)
