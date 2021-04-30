const fs = require('fs')
const path = require('path')
const pkg = require('./package.json')

const webpackAssets = {
  chunks: [],
  bundles: [],
}

const isProduction = process.env.NODE_ENV === 'production'

function BundleListPlugin() {}

BundleListPlugin.prototype.apply = function(compiler) {
  const cdnLinkPrefix = `https://unpkg.com/${pkg.name}@${pkg.version}/dist`
  const distDir = './dist'

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
    main: path.resolve(__dirname, './src/build-code/client.js'),
  },
  output: {
    filename: `main.[hash].bundle.js`,
    path: path.resolve(__dirname, './dist/'),
    library: '@twreporter/dual-channel',
    libraryTarget: 'umd',
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
  plugins: [new BundleListPlugin()],
}

module.exports = webpackConfig
