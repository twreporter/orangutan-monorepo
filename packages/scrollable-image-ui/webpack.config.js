const HtmlWebpackPlugin = require('html-webpack-plugin')
const path = require('path')
const webpack = require('webpack')

const devDirname = 'dev'
const isDevelopment = process.env.NODE_ENV === 'development'

const config = {
  mode: isDevelopment ? 'development' : 'production',
  entry: './src/client.js',
  output: {
    path: path.resolve(__dirname, 'dist/'),
    filename: '[name].[hash].bundle.js',
  },
  optimization: {
    minimize: !isDevelopment,
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
