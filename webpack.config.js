// const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin
const fs = require('fs')
const path = require('path')

const webpackAssets = {
  javascripts: {
    chunks: [],
    bundles: [],
  },
}

function BundleListPlugin() {}

// BundleListPlugin is used to write the filename of bundles and chunks
// into webpack-assets.json
BundleListPlugin.prototype.apply = function(compiler) {
  compiler.hooks.emit.tap('BundleListPlugin', function(compilation) {
    for (const filename in compilation.assets) {
      if (filename.endsWith('.bundle.js')) {
        webpackAssets.javascripts.bundles.push(`${filename}`)
      } else if (filename.endsWith('.chunk.js')) {
        webpackAssets.javascripts.chunks.push(`${filename}`)
      }
    }

    fs.writeFileSync(
      path.resolve(__dirname, './dist/webpack-assets.json'),
      JSON.stringify(webpackAssets)
    )
  })
}

const config = {
  mode: 'production',
  entry: {
    'scrollable-image':
      './packages/scrollable-image/src/components/scrollable-image.js',
  },
  output: {
    path: path.resolve(__dirname, 'dist/'),
    filename: '[name].[hash].bundle.js',
    chunkFilename: '[name].[chunkhash].chunk.js',
    library: 'orangutan',
    libraryTarget: 'umd',
  },
  optimization: {
    minimize: true,
    splitChunks: {
      maxInitialRequests: 6,
      maxAsyncRequests: 6,
      minChunks: 1,
      cacheGroups: {
        default: false,
        vendors: false,
        polyfill: {
          test: module => {
            return (
              module.context &&
              /node_modules\/(babel-polyfill|core-js|regenerator-runtime)/.test(
                module.context
              )
            )
          },
          name: 'polyfill',
          priority: 9,
          chunks: 'initial',
        },
        react: {
          test: module => {
            return (
              module.context &&
              /node_modules\/(react|history|redux|styled-components)/.test(
                module.context
              ) &&
              !/node_modules\/@twreporter/.test(module.context)
            )
          },
          name: 'react-base',
          priority: 10,
          chunks: 'initial',
        },
        twreporter: {
          test: module => {
            return (
              module.context &&
              module.context.includes('node_modules/@twreporter')
            )
          },
          name: 'twreporter-base',
          priority: 10,
          chunks: 'initial',
          reuseExistingChunk: true,
        },
        lodash: {
          test: module => {
            return (
              module.context && module.context.includes('node_modules/lodash')
            )
          },
          name: 'lodash',
          priority: 11,
          chunks: 'initial',
          reuseExistingChunk: true,
        },
      },
    },
  },
  module: {
    rules: [
      {
        test: /\.jsx?$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
          options: {
            rootMode: 'upward',
          },
        },
      },
      {
        test: /\.(jpe?g|png|gif|svg|mp4)$/i,
        use: {
          loader: 'url-loader',
        },
      },
    ],
  },
  plugins: [
    new BundleListPlugin(),
    // new BundleAnalyzerPlugin()
  ],
}

module.exports = config
