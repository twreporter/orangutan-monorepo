const fs = require('fs')
const path = require('path')
// const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;
const pkg = require('./package.json')
const cdnLinkPrefix = `https://unpkg.com/${pkg.name}@${pkg.version}/dist`
const distDir = './dist'

const isProduction = process.env.NODE_ENV === 'production'

const webpackAssets = {
  chunks: [],
  bundles: [],
}

function BundleListPlugin() {}

BundleListPlugin.prototype.apply = function(compiler) {
  compiler.hooks.emit.tap('BundleListPlugin', function(compilation) {
    for (const filename in compilation.assets) {
      const isBundle = filename.endsWith('bundle.js')
      const scriptSrc = isProduction
        ? `${cdnLinkPrefix}/${filename}`
        : `/dist/${filename}`

      if (isBundle) {
        webpackAssets.bundles.push(scriptSrc)
      } else {
        webpackAssets.chunks.push(scriptSrc)
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

const webpackConfig = {
  mode: isProduction ? 'production' : 'development',
  entry: {
    main: path.resolve(__dirname, './src/bundle-entry.js'),
  },
  output: {
    filename: '[name].[hash].bundle.js',
    path: path.resolve(__dirname, './dist/'),
    chunkFilename: '[name].[chunkhash].chunk.js',
    library: pkg.name,
    libraryTarget: 'umd',
  },
  optimization: {
    minimize: isProduction,
    splitChunks: {
      chunks: 'initial',
      cacheGroups: {
        vendors: {
          test: module => {
            return module.context && module.context.includes('node_modules/')
          },
          name: 'vendors',
          priority: 5,
          reuseExistingChunk: true,
          enforce: true,
        },
        twreporter: {
          test: module => {
            return (
              module.context &&
              module.context.includes('node_modules/@twreporter')
            )
          },
          name: 'twreporter-base',
          priority: 9,
          reuseExistingChunk: true,
          enforce: true,
        },
        materialUI: {
          test: /node_modules\/(@material-ui)/,
          name: 'material-ui',
          priority: 10,
          reuseExistingChunk: true,
          enforce: true,
        },
        materialUIDeps: {
          test: /node_modules\/(jss|popper\.js)/,
          name: 'material-ui-deps',
          priority: 10,
          reuseExistingChunk: true,
          enforce: true,
        },
        react: {
          test: /node_modules\/(react|prop-types)/,
          name: 'react-base',
          priority: 11,
          reuseExistingChunk: true,
          enforce: true,
        },
        axios: {
          test: module => {
            return (
              module.context && module.context.includes('node_modules/axios')
            )
          },
          name: 'axios',
          priority: 11,
          reuseExistingChunk: true,
          enforce: true,
        },
        lodash: {
          test: module => {
            return (
              module.context && module.context.includes('node_modules/lodash')
            )
          },
          name: `lodash`,
          priority: 12,
          reuseExistingChunk: true,
          enforce: true,
        },
        polyfill: {
          test: /node_modules\/(@babel|babel-polyfill|core-js|regenerator-runtime)/,
          name: 'polyfill',
          priority: 13,
          enforce: true,
        },
      },
    },
  },
  module: {
    rules: [
      {
        test: /\.jsx?$/,
        loader: 'babel-loader',
        exclude: /node_modules/,
        options: {
          rootMode: 'upward',
          presets: [
            [
              '@babel/env',
              // Config the bundle for browsers
              {
                useBuiltIns: 'usage',
                modules: 'auto',
                targets: 'last 2 versions, not dead', // Ref: https://github.com/browserslist/browserslist#best-practices
              },
            ],
          ],
        },
      },
      {
        test: /\.svg$/,
        use: ['@svgr/webpack'],
      },
    ],
  },
  plugins: [
    new BundleListPlugin(),
    // new BundleAnalyzerPlugin()
  ],
}

module.exports = webpackConfig
