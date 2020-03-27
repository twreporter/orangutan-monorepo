const HtmlWebpackPlugin = require('html-webpack-plugin')
const path = require('path')
const webpack = require('webpack')
const baseConfig = require('../webpack.config')

const config = {
  ...baseConfig,
  mode: 'development',
  entry: {
    main: path.join(__dirname, 'entry.js'),
  },
  devServer: {
    hot: true,
    watchContentBase: false,
    host: '0.0.0.0',
    port: 8080,
  },
  devtool: 'eval-source-map',
  plugins: [
    new HtmlWebpackPlugin({
      minify: false,
      template: path.join(__dirname, 'index.html'),
    }),
    new webpack.HotModuleReplacementPlugin(),
  ],
}

module.exports = config
