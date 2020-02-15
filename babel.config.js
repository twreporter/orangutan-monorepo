const isProduction = process.env.NODE_ENV === 'production'
const isTest = process.env.NODE_ENV === 'test'

module.exports = {
  ignore: isTest ? [] : ['**/__test__/**/*'],
  presets: [
    '@babel/env',
    [
      '@babel/preset-react',
      {
        development: !isProduction,
      },
    ],
  ],
  plugins: [
    [
      'babel-plugin-styled-components',
      {
        pure: true,
      },
    ],
    '@babel/plugin-proposal-class-properties',
  ],
}
