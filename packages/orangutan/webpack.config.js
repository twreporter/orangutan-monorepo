// const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin
const fs = require('fs')
const path = require('path')
const webpackEntry = require('./webpack-entry')
const pkgJson = require('./package.json')

const isProduction = process.env.NODE_ENV === 'production'
const packagesList = Object.keys(webpackEntry)

/*
 * There will be a `webpack-assets.json` file to store paths to all the assets (chunks, bundles) by different packages
 * After it is initialized, here is an example of content:
 * {
 *   'package1': {
 *     chunks: [],
 *     bundles: []
 *   },
 *   'package2': {
 *     chunks: [],
 *     bundles: []
 *   }
 * }
 */
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

/*
 * BundleListPlugin is used to write the filename of bundles and chunks into webpack-assets.json.
 *
 * examples of two packages `package1`, `package2` to show the content of `webpack-assets.json`:
 *
 * Example1: with common chunks (e.g. `polyfill`, `react-base`)
 *
 *   If the output of webpack contains these files:
 *   [ `common-chunk-1.js`, `package1-bundle.js`, `package2-bundle.js` ]
 *
 *   ```webpack-assets.json
 *   {
 *      'package1': {
 *        chunks: [ `common-chunk-1.js` ],
 *        bundles: [ `package1-bundle.js` ]
 *      },
 *      'package2': {
 *        chunks: [ `common-chunk-1.js` ],
 *        bundles: [ `package2-bundle.js` ]
 *      }
 *   }
 *   ```
 * Example2: with packages' own splitted chunk
 *
 *   Now, package1 has its own splitted chunk, which is not a common chunk and should not load by others
 *
 *   If the output of webpack contains these files:
 *   [ `common-chunk-1.js`, `package1-chunk-js`, `package1-bundle.js`, `package2-bundle.js` ]
 *
 *   ```webpack-assets.json
 *   {
 *      'package1': {
 *        chunks: [
 *          `common-chunk-1.js`,
 *          `package1-chunk-js``
 *        ],
 *        bundles: [ `package1-bundle.js` ]
 *      },
 *      'package2': {
 *        chunks: [ `common-chunk-1.js` ],
 *        bundles: [ `package2-bundle.js` ]
 *      }
 *   }
 *   ```
 */
BundleListPlugin.prototype.apply = function(compiler) {
  const cdnLinkPrefix = `https://unpkg.com/${pkgJson.name}@${pkgJson.version}/dist`
  const distDir = './dist'

  compiler.hooks.emit.tap('BundleListPlugin', function(compilation) {
    for (const filename in compilation.assets) {
      const isBundle = filename.endsWith('bundle.js')
      const targetPackages = packagesList.filter(function(element) {
        return filename.indexOf(`${element}`) !== -1
      })

      const scriptSrc = isProduction
        ? `${cdnLinkPrefix}/${filename}`
        : `/dist/${filename}`

      if (Array.isArray(targetPackages) && targetPackages.length > 0) {
        targetPackages.forEach(function(pkg) {
          webpackAssets[pkg][`${isBundle ? 'bundles' : 'chunks'}`].push(
            scriptSrc
          )
        })
      } else {
        packagesList.forEach(function(pkg) {
          webpackAssets[pkg][`${isBundle ? 'bundles' : 'chunks'}`].push(
            scriptSrc
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
  mode: isProduction ? 'production' : 'development',
  entry: webpackEntry,
  output: {
    path: path.resolve(__dirname, 'dist/'),
    filename: '[name].[chunkhash].bundle.js',
    chunkFilename: '[name].[chunkhash].chunk.js',
    library: pkgJson.name,
    libraryTarget: 'umd',
  },
  optimization: {
    minimize: true,
    splitChunks: {
      chunks: 'initial',
      minChunks: 1,
      cacheGroups: {
        /*
         * common chunks
         */
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
          reuseExistingChunk: true,
          enforce: true,
        },
        react: {
          test: module => {
            return (
              module.context &&
              /node_modules\/(react|history|redux|styled-components)/.test(
                module.context
              )
            )
          },
          name: 'react-base',
          priority: 11,
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
          priority: 10,
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
          priority: 11,
          reuseExistingChunk: true,
          enforce: true,
        },
        /*
         * package's own chunk
         *
         * Example: twreporterCore will be a chunk of package1
         *
         * twreporterCore: {
         *   test: module => {
         *     return (
         *      module.context && module.context.includes('node_modules/@twreporter/core')
         *     )
         *   },
         *   name: `${packages.package1}/twreporter-core`,
         *   priority: 11,
         *   reuseExistingChunk: true,
         * }
         */
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
      },
      {
        test: /\.(jpe?g|png|gif|mp4)$/i,
        use: {
          loader: 'url-loader',
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
    //  new BundleAnalyzerPlugin()
  ],
}

module.exports = config
