// const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin
const HtmlWebpackPlugin = require('html-webpack-plugin')
const path = require('path')
const pkg = require('./package.json')
const webpack = require('webpack')

const devDirname = 'dev'
const isDevelopment = process.env.NODE_ENV === 'development'

const config = {
  mode: isDevelopment ? 'development' : 'production',
  entry: ['@babel/polyfill', './src/client.js'],
  output: {
    path: path.resolve(__dirname, 'dist/'),
    filename: '[name].[hash].bundle.js',
    chunkFilename: '[name].[hash].bundle.js',
    // For path translation, use URL provided by unpkg rather than relative path.
    //
    // The URL we want to make public is
    // https://lab.twreporter.org/projects/zoom-in,
    // and we want to proxy pass it to
    // https://cloud-function-host/zoom-in/index.html.
    //
    // Therefore, in users' browser, the URL would be
    // https://lab.twreporter.org/projects/zoom-in.
    //
    // If we use relative path to be the url of static assets, it would be like
    // https://lab.twreporter.org/projects/some-script.js, and that would be proxy passed to https://cloud-function-host/projects/some-script.js.
    //
    // And it is incorrect URL.
    publicPath: isDevelopment
      ? '/'
      : `https://unpkg.com/${pkg.name}@${pkg.version}/dist/`,
  },
  optimization: {
    minimize: !isDevelopment,
    splitChunks: {
      chunks: 'initial',
      minChunks: 1,
      cacheGroups: {
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
          name: 'lodash',
          priority: 11,
          reuseExistingChunk: true,
          enforce: true,
        },
        materialUI: {
          test: module => {
            return (
              module.context &&
              /node_modules\/@material-ui/.test(module.context)
            )
          },
          name: 'material-ui',
          priority: 8,
          reuseExistingChunk: true,
          enforce: true,
        },
      },
    },
  },
  devtool: isDevelopment ? 'eval-source-map' : false,
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
    new HtmlWebpackPlugin({
      template: path.join(__dirname, devDirname, 'index.html'),
    }),
    // new BundleAnalyzerPlugin()
  ],
}

if (isDevelopment) {
  config.devServer = {
    hot: true,
    watchContentBase: false,
    host: '0.0.0.0',
    port: 8080,
  }
  config.plugins.push(new webpack.HotModuleReplacementPlugin())
}

module.exports = config
