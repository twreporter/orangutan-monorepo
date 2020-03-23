// TODO after moving to `orangutan` repo
// this file could be deleted.

const buildConst = require('./constants').default
const path = require('path')

const webpackConfig = {
  mode: 'production',
  entry: {
    [buildConst.webpack.entryName]: [path.resolve(__dirname, './client.js')],
  },
  output: {
    filename: `${buildConst.webpack.entryName}.[hash].bundle.js`,
    publicPath: '/dist/',
    path: path.resolve(__dirname, '../../dist/'),
  },
  module: {
    rules: [
      {
        test: /\.jsx?$/,
        loader: 'babel-loader',
        exclude: /node_modules/,
        options: {
          presets: [
            [
              'env',
              {
                targets: { browsers: ['>2%', 'ie >= 9'] },
                useBuiltIns: 'entry',
              },
            ],
            'react',
          ],
        },
      },
    ],
  },
  devtool: 'eval-source-map',
}

module.exports = webpackConfig
