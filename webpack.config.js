// const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin
const fs = require('fs')
const path = require('path')

const packages = {
  scrollableImage: 'scrollable-image',
}

const packagesList = Object.values(packages)

const webpackAssets = packagesList.reduce(function(acc, cur) {
  return {
    ...acc,
    [cur]: {
      chunks: [],
      bundles: [],
    },
  }
}, {})

function BundleListPlugin() {}

// BundleListPlugin is used to write the filename of bundles and chunks
// into webpack-assets.json
BundleListPlugin.prototype.apply = function(compiler) {
  const distDir = './dist'

  compiler.hooks.emit.tap('BundleListPlugin', function(compilation) {
    for (const filename in compilation.assets) {
      const isBundle = filename.endsWith('bundle.js')
      const targetPackage = packagesList.find(function(element) {
        return filename.indexOf(`${element}`) !== -1
      })
      if (targetPackage) {
        webpackAssets[targetPackage][`${isBundle ? 'bundles' : 'chunks'}`].push(
          filename
        )
      } else {
        packagesList.forEach(pkg => {
          webpackAssets[pkg][`${isBundle ? 'bundles' : 'chunks'}`].push(
            filename
          )
        })
      }
    }

    if (!fs.existsSync(distDir)) {
      fs.mkdirSync(distDir)
    }
    fs.writeFileSync(
      path.resolve(__dirname, `${distDir}/webpack-assets.json`),
      JSON.stringify(webpackAssets)
    )
  })
}

const config = {
  mode: 'production',
  entry: {
    [`${packages.scrollableImage}/main`]: './packages/scrollable-image/src/components/scrollable-image.js',
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
          name: `lodash`,
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
