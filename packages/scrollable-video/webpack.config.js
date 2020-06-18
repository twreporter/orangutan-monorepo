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
    main: path.resolve(__dirname, './src/build-code/client.js'),
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
  },
  module: {
    rules: [
      {
        test: /\.jsx?$/,
        loader: 'babel-loader',
        exclude: /node_modules/,
        options: {
          rootMode: 'upward',
        },
      },
    ],
  },
  plugins: [
    new BundleListPlugin(),
    // new BundleAnalyzerPlugin()
  ],
}

module.exports = webpackConfig
