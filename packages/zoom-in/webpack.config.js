const fs = require('fs')
const path = require('path')
const pkg = require('./package.json')

const distDirname = 'dist'

const webpackAssets = {
  chunks: [],
  bundles: [],
}

const isProduction = process.env.NODE_ENV === 'production'

function BundleListPlugin() {}

BundleListPlugin.prototype.apply = function(compiler) {
  const cdnLinkPrefix = `https://unpkg.com/${pkg.name}@${pkg.version}/${distDirname}`

  compiler.hooks.emit.tap('BundleListPlugin', function(compilation) {
    for (const filename in compilation.assets) {
      const isBundle = filename.endsWith('bundle.js')
      const scriptSrc = isProduction
        ? `${cdnLinkPrefix}/${filename}`
        : `/${distDirname}/${filename}`

      if (isBundle) {
        webpackAssets.bundles.push(scriptSrc)
      } else {
        webpackAssets.chunks.push(scriptSrc)
      }
    }

    if (!fs.existsSync(distDirname)) {
      fs.mkdirSync(distDirname)
    }

    fs.writeFileSync(
      path.resolve(__dirname, `${distDirname}/webpack-assets.json`),
      JSON.stringify(webpackAssets)
    )
  })
}

const config = {
  mode: isProduction ? 'production' : 'development',
  entry: {
    main: './src/build-code/client.js',
  },
  output: {
    filename: '[name]-[hash].bundle.js',
    path: path.resolve(__dirname, `./${distDirname}/`),
    library: `${pkg.name}`,
    libraryTarget: 'umd',
  },
  devtool: isProduction ? false : 'eval-source-map',
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
  plugins: [new BundleListPlugin()],
}

module.exports = config
