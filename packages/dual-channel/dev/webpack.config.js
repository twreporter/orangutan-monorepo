const HtmlWebpackPlugin = require('html-webpack-plugin')
const path = require('path')
const webpack = require('webpack')

module.exports = {
  mode: 'development',
  entry: {
    main: [path.resolve(__dirname, './client-entry.js')],
  },
  output: {
    filename: '[name]-[hash].js',
  },
  devServer: {
    hot: true,
    watchContentBase: false,
    host: '0.0.0.0',
    port: 8080,
  },
  module: {
    rules: [
      {
        test: /\.jsx?$/,
        include: [
          path.resolve(__dirname, '../src/app'),
          path.resolve(__dirname, '../src/build-code/full-width-wrapper.js'),
          path.resolve(__dirname, './client-entry.js'),
        ],
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
        test: /\.svg$/,
        use: ['@svgr/webpack'],
      },
      {
        test: /\.(jpe?g|png|gif|mp4)$/i,
        use: {
          loader: 'url-loader',
        },
      },
    ],
  },
  plugins: [
    new HtmlWebpackPlugin({
      minify: false,
      template: path.resolve(__dirname, './index.html'),
    }),
    new webpack.HotModuleReplacementPlugin(),
  ],
  devtool: 'eval-source-map',
  resolve: {
    alias: {
      'react-dom': '@hot-loader/react-dom',
    },
  },
}
