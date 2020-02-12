const HtmlWebpackPlugin = require('html-webpack-plugin')
const path = require('path')
const webpack = require('webpack')

const devDirname = 'dev'

const config = {
  mode: 'development',
  entry: `./${devDirname}/entry.js`,
  output: {
    filename: '[name]-[hash].js',
  },
  devServer: {
    hot: true,
    watchContentBase: false,
    host: '0.0.0.0',
    port: 8080,
  },
  devtool: 'eval-source-map',
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
      minify: false,
      template: path.join(__dirname, devDirname, 'index.html'),
    }),
    new webpack.HotModuleReplacementPlugin(),
  ],
}

module.exports = config
